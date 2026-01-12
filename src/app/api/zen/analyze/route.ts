import { NextRequest, NextResponse } from 'next/server'

// Helper function to validate URL
function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (_) {
    return false
  }
}

// Function to analyze text content using LLM
async function analyzeTextContent(text: string): Promise<{
  result: 'AI-Generated' | 'Human-Created' | 'Mixed'
  confidence: number
  analysis: string
}> {
  try {
    const ZAI = await import('z-ai-web-dev-sdk')
    const zai = await ZAI.default.create()

    const prompt = `You are an expert AI content detector. Analyze the following text to determine if it was written by AI or a human.

Consider these factors:
1. Writing style and tone consistency
2. Sentence structure complexity
3. Use of idioms, humor, and cultural references
4. Emotional authenticity
5. Factual accuracy and depth
6. Creative expression

IMPORTANT: You must respond in this exact JSON format:
{
  "result": "AI-Generated" or "Human-Created" or "Mixed",
  "confidence": number (0-100),
  "analysis": "detailed explanation of your reasoning"
}

Text to analyze:
${text}

Provide your analysis as JSON only, no other text.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are an expert AI content detector. You analyze text to determine if it was created by AI or humans. You provide detailed, accurate analysis with confidence scores.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      thinking: { type: 'disabled' }
    })

    const response = completion.choices[0]?.message?.content || ''

    // Try to parse the JSON response
    try {
      // Extract JSON from response if it's wrapped in markdown code blocks
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : response
      const parsed = JSON.parse(jsonString)

      // Validate the response structure
      if (!parsed.result || typeof parsed.confidence !== 'number' || !parsed.analysis) {
        throw new Error('Invalid response structure')
      }

      // Ensure result is valid
      if (!['AI-Generated', 'Human-Created', 'Mixed'].includes(parsed.result)) {
        parsed.result = 'Mixed'
      }

      // Ensure confidence is in valid range
      parsed.confidence = Math.min(100, Math.max(0, parsed.confidence))

      return {
        result: parsed.result,
        confidence: parsed.confidence,
        analysis: parsed.analysis
      }
    } catch (parseError) {
      // If parsing fails, provide a fallback response
      console.error('Failed to parse LLM response:', parseError)
      return {
        result: 'Mixed',
        confidence: 50,
        analysis: 'Unable to determine with high confidence. The text shows characteristics that could be either AI-generated or human-created. For a more accurate assessment, please provide more text or try again later.'
      }
    }
  } catch (error) {
    console.error('Error analyzing text:', error)
    throw new Error('Failed to analyze text content')
  }
}

// Function to analyze video URL using VLM
async function analyzeVideoContent(videoUrl: string): Promise<{
  result: 'AI-Generated' | 'Human-Created' | 'Mixed'
  confidence: number
  analysis: string
}> {
  // Validate video URL
  if (!videoUrl || !isValidUrl(videoUrl)) {
    return {
      result: 'Mixed',
      confidence: 50,
      analysis: 'Invalid video URL provided. Please enter a valid video URL (e.g., https://example.com/video.mp4). Note that some platforms like YouTube, Vimeo, or TikTok videos may not be directly analyzable.'
    }
  }

  // Check if URL is from unsupported platforms
  const unsupportedPlatforms = ['youtube.com', 'youtu.be', 'vimeo.com', 'tiktok.com', 'instagram.com']
  const isUnsupported = unsupportedPlatforms.some(platform => videoUrl.toLowerCase().includes(platform))

  if (isUnsupported) {
    return {
      result: 'Mixed',
      confidence: 50,
      analysis: `This video platform is currently not supported for direct analysis. The VLM API requires direct video file URLs (MP4, AVI, MOV formats) from publicly accessible sources. 

Supported: Direct video file URLs from cloud storage or video hosting services.

Not supported: Streaming platforms (YouTube, Vimeo, TikTok, etc.)

Alternative: Describe the video content in the Text tab for AI-generated content analysis.`
    }
  }

  try {
    const ZAI = await import('z-ai-web-dev-sdk')
    const zai = await ZAI.default.create()

    const prompt = `You are an expert AI content detector specializing in video analysis. Analyze this video to determine if it was created by AI or a human.

Consider these factors:
1. Visual quality and consistency
2. Movement and animation patterns
3. Scene transitions and editing
4. Audio-visual synchronization
5. Presence of artifacts or glitches common in AI-generated content
6. Overall realism and natural behavior

IMPORTANT: You must respond in this exact JSON format:
{
  "result": "AI-Generated" or "Human-Created" or "Mixed",
  "confidence": number (0-100),
  "analysis": "detailed explanation of your reasoning"
}

Video to analyze: ${videoUrl}

Provide your analysis as JSON only, no other text.`

    const completion = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'video_url',
              video_url: {
                url: videoUrl
              }
            }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    })

    const response = completion.choices[0]?.message?.content || ''

    // Try to parse JSON response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : response
      const parsed = JSON.parse(jsonString)

      if (!parsed.result || typeof parsed.confidence !== 'number' || !parsed.analysis) {
        throw new Error('Invalid response structure')
      }

      if (!['AI-Generated', 'Human-Created', 'Mixed'].includes(parsed.result)) {
        parsed.result = 'Mixed'
      }

      parsed.confidence = Math.min(100, Math.max(0, parsed.confidence))

      return {
        result: parsed.result,
        confidence: parsed.confidence,
        analysis: parsed.analysis
      }
    } catch (parseError) {
      console.error('Failed to parse VLM response:', parseError)
      return {
        result: 'Mixed',
        confidence: 50,
        analysis: 'Unable to determine with high confidence. Video analysis requires careful examination. The video may contain both AI-generated and human-created elements. For more accurate results, ensure the video URL is publicly accessible and in a supported format (MP4, AVI, MOV).'
      }
    }
  } catch (error: any) {
    console.error('Error analyzing video:', error)
    // Check for specific API errors
    const errorMessage = error?.message || ''
    
    if (errorMessage.includes('1210') || errorMessage.includes('format') || errorMessage.includes('解析')) {
      return {
        result: 'Mixed',
        confidence: 50,
        analysis: `Video format or URL not supported by analysis API. 

Please ensure:
1. The URL points to a direct video file (MP4, AVI, MOV)
2. The video is publicly accessible without authentication
3. The URL is not from streaming platforms (YouTube, Vimeo, etc.)
4. The video file size is within API limits

Alternative: Copy and describe the video content in the Text tab for AI-generated content analysis.`
      }
    }
    
    // Generic fallback
    return {
      result: 'Mixed',
      confidence: 50,
      analysis: 'Video analysis is currently limited. This may be due to video format, size, or accessibility of the URL. Please ensure the video URL is publicly accessible and in a supported format (MP4, AVI, MOV). For text-based content analysis, use the Text or URL analysis options instead.'
    }
  }
}

// Function to analyze URL content
async function analyzeUrlContent(url: string): Promise<{
  result: 'AI-Generated' | 'Human-Created' | 'Mixed'
  confidence: number
  analysis: string
}> {
  // Validate URL
  if (!url || !isValidUrl(url)) {
    return {
      result: 'Mixed',
      confidence: 50,
      analysis: 'Invalid URL provided. Please enter a valid URL (e.g., https://example.com/article).'
    }
  }

  try {
    const ZAI = await import('z-ai-web-dev-sdk')
    const zai = await ZAI.default.create()

    const prompt = `You are an expert AI content detector. Analyze the content at this URL to determine if it was created by AI or a human.

IMPORTANT: You must respond in this exact JSON format:
{
  "result": "AI-Generated" or "Human-Created" or "Mixed",
  "confidence": number (0-100),
  "analysis": "detailed explanation of your reasoning"
}

URL to analyze: ${url}

Provide your analysis as JSON only, no other text.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'file_url',
              file_url: {
                url
              }
            }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    })

    const response = completion.choices[0]?.message?.content || ''

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : response
      const parsed = JSON.parse(jsonString)

      if (!parsed.result || typeof parsed.confidence !== 'number' || !parsed.analysis) {
        throw new Error('Invalid response structure')
      }

      if (!['AI-Generated', 'Human-Created', 'Mixed'].includes(parsed.result)) {
        parsed.result = 'Mixed'
      }

      parsed.confidence = Math.min(100, Math.max(0, parsed.confidence))

      return {
        result: parsed.result,
        confidence: parsed.confidence,
        analysis: parsed.analysis
      }
    } catch (parseError) {
      console.error('Failed to parse URL analysis response:', parseError)
      return {
        result: 'Mixed',
        confidence: 50,
        analysis: 'Unable to access or analyze the URL content. Please ensure the URL is publicly accessible and not behind authentication or paywalls. For direct text analysis, consider using the Text tab instead.'
      }
    }
  } catch (error: any) {
    console.error('Error analyzing URL:', error)
    const errorMessage = error?.message || ''
    
    if (errorMessage.includes('1210') || errorMessage.includes('format') || errorMessage.includes('解析')) {
      return {
        result: 'Mixed',
        confidence: 50,
        analysis: `URL content format or access issue. 

Please ensure:
1. The URL is publicly accessible without authentication
2. The content type is supported (articles, text pages, documents)
3. The page is not behind a paywall or login requirement

Alternative: Copy and paste the text content directly into the Text tab for analysis.`
      }
    }
    
    return {
      result: 'Mixed',
      confidence: 50,
      analysis: 'URL analysis encountered an error. This could be due to network issues, access restrictions, or unsupported content types. Please verify the URL is accessible and try again.'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, content } = body

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Type and content are required' },
        { status: 400 }
      )
    }

    let result
    switch (type) {
      case 'text':
        result = await analyzeTextContent(content)
        break
      case 'video':
        result = await analyzeVideoContent(content)
        break
      case 'url':
        result = await analyzeUrlContent(content)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    )
  }
}
