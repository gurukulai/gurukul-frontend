
import { Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AI_AGENTS, AgentId } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  agentConfig?: typeof AI_AGENTS[AgentId];
}

export const MessageBubble = ({ message, agentConfig }: MessageBubbleProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {!isUser && (
          <Avatar className="w-8 h-8 mb-1">
            <AvatarFallback 
              className={`text-white text-xs`}
              style={{ backgroundColor: agentConfig?.primaryColor }}
            >
              {agentConfig?.icon || '🤖'}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={`space-y-1`}>
          <div
            className={`rounded-2xl px-4 py-2 ${
              isUser
                ? 'bg-primary text-primary-foreground ml-2'
                : `text-gray-800 mr-2`
            }`}
            style={!isUser ? { 
              backgroundColor: agentConfig?.primaryColor ? `${agentConfig.primaryColor}15` : '#f3f4f6',
              borderColor: agentConfig?.primaryColor ? `${agentConfig.primaryColor}30` : '#e5e7eb',
              borderWidth: '1px'
            } : {}}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
          
          <p className={`text-xs text-gray-500 ${isUser ? 'text-right mr-2' : 'text-left ml-2'}`}>
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </p>
        </div>
        
        {isUser && (
          <Avatar className="w-8 h-8 mb-1">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              U
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};
