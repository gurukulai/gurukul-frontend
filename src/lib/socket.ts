import { ChartNoAxesColumnDecreasing } from 'lucide-react';
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
  private messageQueue: SocketMessage[] = [];
  private isConnecting = false;
  private eventListeners: Map<string, Set<(data: SocketMessageData) => void>> = new Map();

  constructor() {
    this.setupPingInterval = this.setupPingInterval.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
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

      try {
        this.socket = io(wsUrl, {
          extraHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        this.socket.on('connect', () => {
          console.log('Socket.IO connected');
          this.isConnecting = false;
          this.setupPingInterval();
          this.flushMessageQueue();
          resolve();
        });

        this.socket.on('connect_error', (err: Error) => {
          this.isConnecting = false;
          console.error('Socket.IO connection error:', err);
          reject(err);
        });

        this.socket.on('disconnect', (reason: string) => {
          this.handleClose({ code: 1000, reason } as CloseEvent);
        });

        this.socket.on('message', (message: SocketMessage) => {
          this.handleMessage({ data: JSON.stringify(message) } as MessageEvent);
        });

        this.socket.on('error', (data: unknown) => {
          this.handleError({} as Event);
        });

        // Listen for all custom events
        ['pong', 'error', 'typing', 'read_receipt', 'chat_update'].forEach((event) => {
          this.socket!.on(event, (data: SocketMessageData) => {
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
        this.send({
          type: 'ping',
          data: { timestamp: Date.now() },
          timestamp: Date.now()
        });
      }
    }, 30000); // Ping every 30 seconds
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: SocketMessage = JSON.parse(event.data);
      switch (message.type) {
        case 'pong':
          // Handle pong response
          break;
        case 'error':
          console.error('Socket.IO error 1:', message.data);
          this.emit('error', message.data);
          break;
        default:
          this.emit(message.type, message.data);
      }
    } catch (error) {
      console.error('Failed to parse Socket.IO message:', error);
    }
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

  send(message: SocketMessage): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message', message);
    } else {
      // Queue message for later if not connected
      this.messageQueue.push(message);
    }
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
    this.send({
      type: 'chat_update',
      data: { action: 'join', chatId },
      timestamp: Date.now()
    });
  }

  leaveChat(chatId: string): void {
    this.send({
      type: 'chat_update',
      data: { action: 'leave', chatId },
      timestamp: Date.now()
    });
  }

  sendMessage(chatId: string, content: string, agentId: string): void {
    const messageId = `temp-${Date.now()}-${Math.random()}`;
    this.send({
      type: 'message',
      data: { chatId, content, agentId, messageId },
      timestamp: Date.now(),
      messageId
    });
  }

  sendTyping(chatId: string, userId: string, agentId: string, isTyping: boolean): void {
    this.send({
      type: 'typing',
      data: { chatId, userId, agentId, isTyping },
      timestamp: Date.now()
    });
  }

  sendReadReceipt(chatId: string, messageIds: string[], userId: string): void {
    this.send({
      type: 'read_receipt',
      data: { chatId, messageIds, userId },
      timestamp: Date.now()
    });
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