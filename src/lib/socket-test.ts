// Simple test for socket implementation
import { socketService } from './socket';

// Test connection
export const testSocketConnection = async (token: string) => {
  try {
    console.log('Testing socket connection...');
    await socketService.connect(token);
    console.log('✅ Socket connected successfully');
    
    // Test sending a message
    const testChatId = 'test-chat-123';
    const testAgentId = 'therapist';
    
    socketService.sendMessage(testChatId, 'Hello, this is a test message', testAgentId);
    console.log('✅ Test message sent');
    
    // Test typing indicator
    socketService.sendTyping(testChatId, 'user-123', testAgentId, true);
    console.log('✅ Typing indicator sent');
    
    // Test read receipt
    socketService.sendReadReceipt(testChatId, ['msg-1', 'msg-2'], 'user-123');
    console.log('✅ Read receipt sent');
    
    // Test joining chat
    socketService.joinChat(testChatId);
    console.log('✅ Joined chat');
    
    return true;
  } catch (error) {
    console.error('❌ Socket test failed:', error);
    return false;
  }
};

// Test event listeners
export const testSocketListeners = () => {
  console.log('Testing socket event listeners...');
  
  socketService.on('message', (data) => {
    console.log('✅ Received message:', data);
  });
  
  socketService.on('typing', (data) => {
    console.log('✅ Received typing event:', data);
  });
  
  socketService.on('read_receipt', (data) => {
    console.log('✅ Received read receipt:', data);
  });
  
  socketService.on('chat_update', (data) => {
    console.log('✅ Received chat update:', data);
  });
  
  socketService.on('error', (data) => {
    console.error('❌ Received error:', data);
  });
  
  socketService.on('disconnect', (data) => {
    console.log('⚠️ Received disconnect:', data);
  });
  
  console.log('✅ Event listeners set up');
}; 