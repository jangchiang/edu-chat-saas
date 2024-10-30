// src/app/utils/educationFilter.ts
type Topic = {
    category: string
    keywords: string[]
  }
  
  const EDUCATIONAL_TOPICS: Topic[] = [
    {
      category: 'Academic Subjects',
      keywords: ['math', 'science', 'history', 'literature', 'geography', 'physics', 'chemistry', 'biology', 'computer science']
    },
    {
      category: 'Study Skills',
      keywords: ['study', 'homework', 'exam', 'test', 'research', 'essay', 'assignment', 'revision', 'learning']
    },
    {
      category: 'Higher Education',
      keywords: ['university', 'college', 'degree', 'major', 'minor', 'graduate', 'undergraduate', 'admission', 'scholarship']
    },
    {
      category: 'Study Abroad',
      keywords: ['international', 'abroad', 'exchange', 'foreign', 'global', 'overseas', 'international student']
    },
    {
        category: 'Question',
        keywords: ['where', 'why', 'how', 'who', 'whom', 'whose', 'when', 'which', 'what']
    }
  ]
  
  export function isEducationalQuery(query: string): { 
    isEducational: boolean
    category?: string
    confidence: number
    reason?: string
  } {
    const lowercaseQuery = query.toLowerCase()
    let maxConfidence = 0
    let matchedCategory = ''
    
    for (const topic of EDUCATIONAL_TOPICS) {
      const matchingKeywords = topic.keywords.filter(keyword => 
        lowercaseQuery.includes(keyword)
      )
      
      const confidence = matchingKeywords.length / Math.sqrt(lowercaseQuery.split(' ').length)
      if (confidence > maxConfidence) {
        maxConfidence = confidence
        matchedCategory = topic.category
      }
    }
  
    return {
      isEducational: maxConfidence > 0.2,
      category: matchedCategory,
      confidence: Math.min(maxConfidence, 1),
      reason: maxConfidence > 0.2 
        ? `Query appears to be about ${matchedCategory.toLowerCase()}`
        : "Query doesn't appear to be education-related"
    }
  }