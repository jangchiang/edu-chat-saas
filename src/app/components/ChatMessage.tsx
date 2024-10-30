// src/app/components/ChatMessage.tsx
'use client'

import { MessageCircle, Bot } from 'lucide-react'
import type { Message } from '@/app/utils/types'

interface ChatMessageProps {
  message: Message
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-500' : 'bg-gray-200'
          }`}>
            {isUser ? (
              <MessageCircle className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-gray-600" />
            )}
          </div>
        </div>
        <div
          className={`flex flex-col ${
            isUser
              ? 'bg-blue-500 text-white'
              : 'bg-white border border-gray-200'
          } rounded-lg px-4 py-3 shadow-sm`}
        >
          {message.category && (
            <div className={`text-xs mb-1 ${
              isUser ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {message.category}
            </div>
          )}
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>
    </div>
  )
}
