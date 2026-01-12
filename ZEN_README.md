# 🧠 Zen - AI Content Detection Application

<div align="center">

**Detect AI-generated content in an era where artificial creativity blurs the line between human and machine**

![Zen](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

## 🌟 About Zen

In today's world, distinguishing between AI-generated and human-created content has become increasingly difficult. Zen solves this problem by providing a powerful, user-friendly platform to detect AI-generated content across multiple formats.

### 🎯 What Zen Does

- **Text Analysis** - Detect AI-written news articles, social media posts, threads, and more
- **Video Analysis** - Identify AI-generated videos and synthetic content
- **URL Analysis** - Analyze web content directly from URLs
- **Confidence Scoring** - Get percentage-based confidence levels for each detection
- **Detailed Insights** - Understand why content was classified as AI, human, or mixed

## ✨ Key Features

### 🎨 Beautiful User Interface
- Modern, responsive design with purple/pink gradient theme
- Intuitive tabbed interface for different content types
- Real-time loading states and user feedback
- Mobile-friendly layout that works on any device

### 🤖 AI-Powered Detection Engine
- **LLM Integration** - Advanced text analysis using Large Language Models
- **VLM Integration** - Vision-based content analysis for videos and images
- **Pattern Recognition** - Sophisticated algorithms to identify AI characteristics
- **Multi-Format Support** - Analyze text, videos, and web URLs

### 📊 Comprehensive Results
- Clear classification: AI-Generated, Human-Created, or Mixed
- Confidence scores from 0-100%
- Detailed analysis explanations
- Content preview and history tracking

### 🗄️ History & Management
- Automatically stores your last 10 analyses
- Click to view full details of any past analysis
- Timestamps and confidence score tracking

## 🛠️ Technology Stack

### Frontend
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first styling
- **🧩 shadcn/ui** - High-quality UI components
- **🎯 Lucide React** - Beautiful icons

### Backend
- **🔄 Next.js API Routes** - Serverless API endpoints
- **🗄️ Prisma ORM** - Database management
- **💾 SQLite** - Local database for development

### AI Capabilities
- **🧠 z-ai-web-dev-sdk** - AI/ML integration
- **📝 LLM Skill** - Text content analysis
- **👁️ VLM Skill** - Visual content analysis

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git
- GitHub account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/zen.git
cd zen

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up the database
bun run db:push

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see Zen in action!

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./db/custom.db"
# Add any other required environment variables
```

## 📖 Usage Guide

### Analyzing Text

1. Navigate to the **Text** tab
2. Paste your text (news articles, threads, social posts, etc.)
3. Click **Analyze Text**
4. Review results with confidence scores and detailed analysis

### Analyzing Videos

1. Navigate to the **Video** tab
2. Enter a video URL
3. Click **Analyze Video**
4. Get AI detection results with visual analysis

### Analyzing URLs

1. Navigate to the **URL** tab
2. Enter the content URL
3. Click **Analyze URL**
4. Receive comprehensive analysis of the web content

### Viewing History

Your last 10 analyses are automatically saved. Click any history item to view:
- Full analysis details
- Confidence scores
- Content preview
- Timestamp

## 📁 Project Structure

```
zen/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── zen/
│   │   │       └── analyze/
│   │   │           └── route.ts       # Analysis API endpoints
│   │   ├── page.tsx                  # Main application page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   └── ui/                      # shadcn/ui components
│   ├── hooks/                       # Custom React hooks
│   └── lib/
│       ├── db.ts                     # Database client
│       └── utils.ts                 # Utility functions
├── prisma/
│   └── schema.prisma                # Database schema
├── public/                         # Static assets
└── package.json
```

## 🗄️ Database Schema

### DetectionResult Model

```prisma
model DetectionResult {
  id         String   @id @default(cuid())
  type       String   // 'text' | 'video' | 'url'
  content    String   // Analyzed content
  result     String   // 'AI-Generated' | 'Human-Created' | 'Mixed'
  confidence Int      // Confidence score 0-100
  analysis   String   // Detailed analysis
  createdAt  DateTime @default(now())
}
```

## 🔧 Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run lint         # Run ESLint

# Database
bun run db:push      # Push schema changes to database
bun run db:studio    # Open Prisma Studio (GUI)

# Production
bun run build        # Build for production
bun start            # Start production server
```

## 🎨 Customization

### Changing the Theme

Edit `tailwind.config.ts` and update color schemes:

```typescript
theme: {
  extend: {
    colors: {
      // Customize your colors here
    }
  }
}
```

### Adding New Content Types

1. Update `ContentType` type in `src/app/page.tsx`
2. Add new tab in the UI
3. Create corresponding analysis function in `src/app/api/zen/analyze/route.ts`
4. Update the switch statement in the POST handler

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.


## 🌟 Star History

If you find Zen helpful, please consider giving it a star on GitHub! ⭐

---

<div align="center">

**Made to help distinguish AI from human creativity**

Built by Arpit 

</div>
