// src/app/components/ChatInterface.tsx
'use client'

import { useState, useEffect } from 'react'
import { Send, Loader2, BookOpen, Trash } from 'lucide-react'
import { ChatMessage } from './ChatMessage'
import { isEducationalQuery } from '@/app/utils/educationFilter'
import type { Message } from '@/app/utils/types'

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load conversation history from localStorage on initial load
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  // Save conversation history to localStorage whenever it changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages))
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setError('')
    const queryCheck = isEducationalQuery(input)
    
    if (!queryCheck.isEducational) {
      setError(`I can only help with educational topics. ${queryCheck.reason}`)
      return
    }

    setLoading(true)
    const userMessage: Message = {
      role: 'user',
      content: input,
      category: queryCheck.category,
      timestamp: Date.now()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          category: queryCheck.category,
          conversationHistory: messages // Send conversation history
        }),
      })
      
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        return
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        category: queryCheck.category,
        timestamp: Date.now()
      }])
    } catch (error) {
      setError('An error occurred while processing your request.')
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    setMessages([])
    localStorage.removeItem('chatHistory')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Educational AI Assistant
        </h1>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Test mode
        </h2>
        <h2 className="text-xl font-bold text-center text-gray-500 mb-2">V1.1.7</h2>
        <p className="text-center text-gray-600">
          Ask any education-related question and get helpful answers
        </p>
        <p className="text-center text-red-600">Now we get for free to ask and there are no any store data please feel comfortable to ask</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
          <span className="text-sm text-gray-600">Conversation History</span>
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-red-500 hover:text-red-600 flex items-center text-sm"
            >
              <Trash className="w-4 h-4 mr-1" />
              Clear History
            </button>
          )}
        </div>

        <div className="h-[600px] overflow-y-auto p-4" id="chat-container">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-center p-8">
              <div>
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Start Your Learning Journey</h3>
                <p className="text-sm">
                  Ask any question about your studies, and I'll help you understand the topic better.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, idx) => (
              <ChatMessage key={idx} message={message} />
            ))
          )}
        </div>

        <div className="border-t border-gray-200 p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ask your educational question..."
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="ml-2 hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}