// src/app/utils/fetchModelResponse.ts
import Groq from 'groq-sdk'
import { ModelOption, Message } from './types'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

const EDUCATIONAL_SYSTEM_PROMPT = `You are an educational AI assistant with memory of the conversation context. Your responses should:

1. Remember and reference previous questions and answers from our conversation
2. Build upon previously discussed topics when relevant
3. Maintain context awareness throughout the conversation
4. Use the conversation history to provide more personalized and relevant responses
5. Refer back to earlier points when making connections
6. Adapt your explanations based on the user's previous questions and understanding level

Additional guidelines:
- Acknowledge previous questions when relevant
- Use phrases like "As we discussed earlier..." when appropriate
- Make connections between related topics from earlier in the conversation
- Build upon previously shared examples
- Maintain consistency in explanations
- Remember user's specific interests or focus areas

Current subject area: {category}
Level: University/Higher Education`

async function getGroqResponse(
  messages: Message[],
  systemPrompt: string
): Promise<string> {
  try {
    console.log('Using LLaMA model via Groq with context');
    
    // Convert messages to Groq format, including conversation history
    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ]

    const completion = await groq.chat.completions.create({
      messages: groqMessages,
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 0.9,
      stream: false
    })

    if (!completion.choices[0].message?.content) {
      throw new Error('No response content received from LLaMA')
    }

    return completion.choices[0].message.content

  } catch (error: any) {
    console.error('LLaMA API Error:', error)
    throw new Error(error?.message || 'Error getting response from LLaMA')
  }
}

interface FetchModelResponseParams {
  messages: Message[]
  category: string
}

export async function fetchModelResponse({
  messages,
  category,
}: FetchModelResponseParams): Promise<{ message: string; error?: string }> {
  try {
    console.log('Fetching contextual response from LLaMA');
    
    const systemPrompt = EDUCATIONAL_SYSTEM_PROMPT.replace('{category}', category)
    const response = await getGroqResponse(messages, systemPrompt)
    return { message: response }

  } catch (error: any) {
    console.error('Error fetching response:', error)
    let errorMessage = error?.message || 'An error occurred while processing your request'
    
    if (errorMessage.includes('API key')) {
      errorMessage = 'There was an issue with the API configuration. Please try again later.'
    } else if (errorMessage.includes('model_not_found')) {
      errorMessage = 'The LLaMA model is currently unavailable. Please try again later.'
    }
    
    return {
      message: 'Sorry, there was an error getting a response.',
      error: errorMessage
    }
  }
}