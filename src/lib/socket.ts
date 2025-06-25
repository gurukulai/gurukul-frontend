import { Message, Chat } from './types';
import { io, Socket } from 'socket.io-client';

export interface SocketMessage {
  type: 'message' | 'typing' | 'read_receipt' | 'chat_update' | 'error' | 'ping' | 'pong';
  data: SocketMessageData;
  timestamp: number;
  messageId?: string;
}

export type SocketMessageData = 
  | MessageData
  | TypingEvent
  | ReadReceipt
  | ChatUpdate
  | ErrorData
  | PingData
  | PongData;

export interface MessageData {
  chatId: string;
  content: string;
  agentId: string;
  messageId?: string;
  message?: Message;
}

export interface TypingEvent {
  chatId: string;
  userId: string;
  agentId: string;
  isTyping: boolean;
}

export interface ReadReceipt {
  chatId: string;
  messageIds: string[];
  userId: string;
}

export interface ChatUpdate {
  chatId: string;
  updates?: Partial<Chat>;
  action?: 'join' | 'leave';
}

export interface ErrorData {
  message: string;
  code?: number;
}

export interface PingData {
  timestamp: number;
}

export interface PongData {
  timestamp: number;
}

class WebSocketService {
  private socket: Socket | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private messageQueue: Array<{ chatId: string; content: string; agentId: string; messageId: string }> = [];
  private isConnecting = false;
  private eventListeners: Map<string, Set<(data: SocketMessageData) => void>> = new Map();

  constructor() {
    this.setupPingInterval = this.setupPingInterval.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.connected) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
      
      console.log('Attempting to connect to WebSocket:', wsUrl);

      try {
        this.socket = io(wsUrl, {
          extraHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        this.socket.on('connect', () => {
          console.log('Socket.IO connected successfully');
          this.isConnecting = false;
          this.setupPingInterval();
          this.flushMessageQueue();
          resolve();
        });

        this.socket.on('connect_error', (err: Error) => {
          this.isConnecting = false;
          console.error('Socket.IO connection error:', {
            message: err.message,
            name: err.name,
            stack: err.stack,
            url: wsUrl
          });
          reject(err);
        });

        this.socket.on('disconnect', (reason: string) => {
          console.log('Socket.IO disconnected:', reason);
          this.handleClose({ code: 1000, reason } as CloseEvent);
        });

        this.socket.on('reconnect', (attemptNumber: number) => {
          console.log('Socket.IO reconnected after', attemptNumber, 'attempts');
        });

        this.socket.on('reconnect_error', (error: Error) => {
          console.error('Socket.IO reconnection error:', error);
        });

        this.socket.on('error', (data: unknown) => {
          console.error('Socket.IO error event:', data);
          this.handleError({} as Event);
        });

        // Listen for all custom events
        ['message', 'pong', 'error', 'typing', 'read_receipt', 'chat_update'].forEach((event) => {
          this.socket!.on(event, (data: SocketMessageData) => {
            console.log(`Received ${event} event:`, data);
            this.emit(event, data);
          });
        });

        // Set connection timeout
        setTimeout(() => {
          if (!this.socket?.connected) {
            this.isConnecting = false;
            reject(new Error('Connection timeout'));
          }
        }, 10000);
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.eventListeners.clear();
    this.messageQueue = [];
  }

  private setupPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.connected) {
        this.socket.emit('ping', { timestamp: Date.now() });
      }
    }, 30000); // Ping every 30 seconds
  }

  private handleError(event: Event): void {
    console.error('Socket.IO error 2:', event);
    this.emit('error', { message: 'Socket.IO connection error' });
  }

  private handleClose(event: CloseEvent): void {
    console.log('Socket.IO disconnected:', event.code, event.reason);

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    this.emit('disconnect', { message: `Disconnected: ${event.reason}`, code: event.code });
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message && this.socket && this.socket.connected) {
        this.socket.emit('message', message);
      }
    }
  }

  // Event handling
  on(event: string, callback: (data: SocketMessageData) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: SocketMessageData) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data: SocketMessageData): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // Chat-specific methods
  joinChat(chatId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('chat_update', { chatId, action: 'join' });
    }
  }

  leaveChat(chatId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('chat_update', { chatId, action: 'leave' });
    }
  }

  sendMessage(chatId: string, content: string, agentId: string): void {
    const messageId = `temp-${Date.now()}-${Math.random()}`;
    if (this.socket && this.socket.connected) {
      this.socket.emit('message', { chatId, content, agentId, messageId });
    } else {
      // Queue message for later if not connected
      this.messageQueue.push({ chatId, content, agentId, messageId });
    }
  }

  sendTyping(chatId: string, userId: string, agentId: string, isTyping: boolean): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing', { chatId, userId, agentId, isTyping });
    }
  }

  sendReadReceipt(chatId: string, messageIds: string[], userId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('read_receipt', { chatId, messageIds, userId });
    }
  }

  // Utility methods
  isConnected(): boolean {
    return !!(this.socket && this.socket.connected);
  }

  getConnectionState(): number {
    if (!this.socket) return 3; // 3 = CLOSED
    return this.socket.connected ? 1 : 3; // 1 = OPEN, 3 = CLOSED
  }
}

// Export singleton instance
export const socketService = new WebSocketService(); 