// src/app/utils/types.ts
export type ModelProvider = 'groq'

export type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
  category?: string
  timestamp?: number
}

export type ModelOption = {
  id: string
  name: string
  provider: ModelProvider
  description: string
}