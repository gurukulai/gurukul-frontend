
'use client';

import { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  agentColor?: string;
}

export const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message...",
  agentColor = '#FF6B35'
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || disabled) return;

    const messageToSend = message.trim();
    setMessage(''); // Clear input immediately
    setIsSending(true);
    
    try {
      await onSendMessage(messageToSend);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore message on error
      setMessage(messageToSend);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[60px] max-h-[120px] resize-none border-2 focus:border-opacity-50"
            style={{ 
              borderColor: `${agentColor}30`
            }}
          />
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="h-[60px] px-4 text-white"
          style={{ backgroundColor: agentColor }}
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
