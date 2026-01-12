'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Brain, FileText, Video, History, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

type ContentType = 'text' | 'video' | 'url'

interface DetectionResult {
  id: string
  type: ContentType
  content: string
  result: 'AI-Generated' | 'Human-Created' | 'Mixed'
  confidence: number
  analysis: string
  timestamp: Date
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<ContentType>('text')
  const [textInput, setTextInput] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [history, setHistory] = useState<DetectionResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const analyzeContent = async (type: ContentType, content: string) => {
    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/zen/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          content,
        }),
      })

      const data = await response.json()

      // Check if response is OK
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze content')
      }

      // The API now returns results even when there are analysis issues
      const detectionResult: DetectionResult = {
        id: Date.now().toString(),
        type,
        content,
        result: data.result,
        confidence: data.confidence,
        analysis: data.analysis,
        timestamp: new Date(),
      }

      setResult(detectionResult)
      setHistory([detectionResult, ...history].slice(0, 10))
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to analyze content. Please try again.'
      setError(errorMessage)
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleTextAnalyze = () => {
    if (!textInput.trim()) {
      setError('Please enter some text to analyze')
      return
    }
    analyzeContent('text', textInput)
  }

  const handleVideoAnalyze = () => {
    if (!videoUrl.trim()) {
      setError('Please enter a video URL')
      return
    }
    analyzeContent('video', videoUrl)
  }

  const handleUrlAnalyze = () => {
    if (!urlInput.trim()) {
      setError('Please enter a URL to analyze')
      return
    }
    analyzeContent('url', urlInput)
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case 'AI-Generated':
        return 'destructive'
      case 'Human-Created':
        return 'default'
      case 'Mixed':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'AI-Generated':
        return <Brain className="h-5 w-5" />
      case 'Human-Created':
        return <CheckCircle2 className="h-5 w-5" />
      case 'Mixed':
        return <AlertCircle className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                Zen
              </h1>
              <p className="text-xs text-slate-500">AI Content Detector</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Detect AI-Generated Content
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              In an era where AI can create anything, Zen helps you distinguish between human and artificial content. Analyze text, videos, and more.
            </p>
          </div>

          {/* Main Detection Card */}
          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Content Analysis</CardTitle>
              <CardDescription>
                Choose the type of content you want to analyze for AI generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as ContentType)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Enter text to analyze (news articles, threads, social posts, etc.)
                    </label>
                    <Textarea
                      placeholder="Paste your text here..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      rows={8}
                      className="resize-none"
                    />
                  </div>
                  <Button
                    onClick={handleTextAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Text'
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="video" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Enter video URL for analysis
                    </label>
                    <Input
                      type="url"
                      placeholder="https://example.com/video.mp4"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                    <p className="text-xs text-slate-500">
                      Note: Video analysis is based on URL patterns and source indicators.
                      For detailed content analysis, download the video and analyze screenshots.
                    </p>
                  </div>
                  <Button
                    onClick={handleVideoAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Video'
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Enter content URL for analysis
                    </label>
                    <Input
                      type="url"
                      placeholder="https://example.com/article"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                    />
                    <p className="text-xs text-slate-500">
                      Note: URL analysis is based on URL patterns and domain indicators.
                      For accurate content analysis, visit the URL and copy the text to the Text tab.
                    </p>
                  </div>
                  <Button
                    onClick={handleUrlAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze URL'
                    )}
                  </Button>
                </TabsContent>
              </Tabs>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Result Card */}
          {result && (
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getResultIcon(result.result)}
                  Analysis Result
                </CardTitle>
                <CardDescription>
                  Analyzed at {result.timestamp.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Result Badge */}
                <div className="flex items-center justify-center py-4">
                  <Badge variant={getResultColor(result.result) as any} className="text-lg px-8 py-3">
                    {result.result}
                  </Badge>
                </div>

                {/* Confidence Level */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Confidence Level</span>
                    <span className="text-slate-600">{result.confidence}%</span>
                  </div>
                  <Progress value={result.confidence} className="h-2" />
                </div>

                {/* Analysis Details */}
                <div className="bg-slate-50 rounded-lg p-4 border">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Analysis Details
                  </h4>
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {result.analysis}
                  </p>
                </div>

                {/* Content Preview */}
                <div className="bg-slate-50 rounded-lg p-4 border">
                  <h4 className="font-semibold mb-2">Analyzed Content</h4>
                  <p className="text-slate-700 text-sm line-clamp-3">
                    {result.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* History Section */}
          {history.length > 0 && (
            <Card className="shadow-xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Analyses
                </CardTitle>
                <CardDescription>
                  Your last 10 detection results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setResult(item)}
                      className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {item.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 line-clamp-2">
                            {item.content}
                          </p>
                        </div>
                        <Badge variant={getResultColor(item.result) as any}>
                          {item.result}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600">Confidence:</span>
                          <Progress value={item.confidence} className="h-1 flex-1" />
                          <span className="text-xs text-slate-600 w-12 text-right">
                            {item.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>AI Detection</CardTitle>
                <CardDescription>
                  Our advanced AI analyzes patterns, structure, and style to identify AI-generated content
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-10 w-10 text-pink-600 mb-2" />
                <CardTitle>Multiple Formats</CardTitle>
                <CardDescription>
                  Analyze text, videos, and URLs to detect synthetic content across different media
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CheckCircle2 className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Confidence Scores</CardTitle>
                <CardDescription>
                  Get detailed confidence levels and analysis to help you make informed decisions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-slate-600">
            <p>Zen - AI Content Detector • Helping you distinguish AI from human</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
