// src/app/api/chat/route.ts
import { NextResponse } from 'next/server'
import { isEducationalQuery } from '@/app/utils/educationFilter'
import { fetchModelResponse } from '@/app/utils/fetchModelResponse'
import { MODEL_OPTIONS } from '@/app/utils/constants'
import type { Message } from '@/app/utils/types'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { message, category, conversationHistory } = body

    // Check if query is educational
    const queryCheck = isEducationalQuery(message)
    if (!queryCheck.isEducational) {
      return NextResponse.json({ 
        error: 'I can only help with educational topics. ' + queryCheck.reason 
      }, { status: 400 })
    }

    // Use conversation history for context
    const messages: Message[] = [
      ...(conversationHistory || []),
      { role: 'user', content: message, timestamp: Date.now() }
    ]

    const result = await fetchModelResponse({
      messages,
      category: queryCheck.category || category
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ message: result.message })

  } catch (error: any) {
    console.error('API Route Error:', error)
    return NextResponse.json({ 
      error: 'An error occurred while processing your request. Please try again.' 
    }, { status: 500 })
  }
}