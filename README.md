# AI Twin - Voice Communication Style Analyzer

An intelligent web application that records your voice, analyzes your communication style, and creates an AI Twin that mimics your tone, personality, and speaking patterns.

![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![React](https://img.shields.io/badge/React-18+-blue)

## ✨ Features

- **🎤 Voice Recording**: Record your voice using browser speech recognition
- **💬 Text Input**: Type messages when voice recording isn't available
- **🧠 Communication Analysis**: AI-powered analysis of tone, style, sentiment, and energy
- **🤖 AI Twin**: Get responses that mirror your communication style
- **💾 Conversation History**: Store and view past conversations
- **📊 Voice Analytics**: Track your communication patterns over time
- **🔄 Demo Mode**: Intelligent fallback when OpenAI quota is exceeded
- **🎨 Modern UI**: Beautiful, responsive interface with dark mode support

## Quick Start

### Prerequisites

- Node.js 20 or higher
- OpenAI API key (optional - app works in demo mode without it)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-twin.git
cd ai-twin
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5000`

## Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Beautiful component library
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **OpenAI API** - AI-powered analysis and responses
- **In-memory storage** - Fast data persistence

### Key Libraries
- **Vite** - Fast build tool and dev server
- **React Hook Form** - Form management
- **Framer Motion** - Smooth animations
- **Web Speech API** - Browser voice recognition

## 📁 Project Structure

```
ai-twin/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── openai.ts          # OpenAI integration
│   └── storage.ts         # Data storage layer
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── components.json        # Shadcn/UI configuration
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key for AI analysis | No |
| `NODE_ENV` | Environment (development/production) | No |

### OpenAI Setup

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new secret key
5. Add the key to your `.env` file

## Usage

### Voice Mode
1. Click the **Voice** tab
2. Press the microphone button to start recording
3. Speak your message
4. Press the button again to stop
5. Watch as your AI Twin responds in your style

### Text Mode
1. Click the **Text** tab
2. Type your message in the input field
3. Press Enter or click Send
4. Get an AI response that matches your communication style

### Analytics
- Click **Voice Analytics** to see your communication patterns
- View tone distribution, style preferences, and confidence levels
- Export conversation history for analysis

## AI Analysis Features

### Communication Style Detection
- **Tone**: Enthusiastic, curious, polite, casual, concerned, thoughtful, neutral
- **Style**: Formal, conversational, inquisitive, casual, detailed, brief, reflective
- **Sentiment**: Positive, negative, neutral
- **Energy**: High, medium, low
- **Confidence**: Analysis reliability score

### Demo Mode Intelligence
When OpenAI quota is exceeded, the app automatically switches to demo mode with:
- Context-aware word analysis
- Pattern recognition for 200+ communication indicators
- Topic-specific responses (AI, work, food, music, travel)
- Dynamic tone and style adaptation

## Privacy & Security

- **Local Processing**: Voice analysis happens in your browser
- **No Data Storage**: Conversations stored only in memory during session
- **Secure API**: OpenAI API calls are server-side only
- **Privacy First**: No personal data transmitted or stored permanently

## Deployment

### Using Replit (Recommended)
1. Import project to Replit
2. Add `OPENAI_API_KEY` to Secrets
3. Click Run
4. Your app is live!

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy to your preferred platform (Vercel, Netlify, Railway)
3. Set environment variables in your deployment platform

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```
3. **Make your changes**
4. **Commit with clear messages**
```bash
git commit -m "Add amazing feature"
```
5. **Push to your branch**
```bash
git push origin feature/amazing-feature
```
6. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed

## 📝 API Documentation

### Core Endpoints

#### POST `/api/process-voice`
Process voice input and generate AI Twin response
```json
{
  "text": "Your message text",
  "conversationId": 1
}
```

#### GET `/api/conversations`
Retrieve conversation history
```json
[
  {
    "id": 1,
    "messages": [...],
    "timestamp": "2025-06-07T07:20:30.000Z"
  }
]
```

#### GET `/api/voice-analytics`
Get voice analysis statistics
```json
{
  "profile": {
    "averageTone": "friendly",
    "speakingStyle": "conversational"
  },
  "recentAnalysis": {
    "totalMessages": 5,
    "averageConfidence": 0.85
  }
}
```

## Troubleshooting

### Common Issues

**Voice recording not working**
- Check browser permissions for microphone access
- Ensure you're using HTTPS (required for Web Speech API)
- Try using text mode as alternative

**OpenAI API errors**
- Verify your API key is correct
- Check your OpenAI account has sufficient credits
- App automatically falls back to demo mode

**Build errors**
- Ensure Node.js version 20 or higher
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Acknowledgments

- [OpenAI](https://openai.com/) for powerful AI capabilities
- [Shadcn/UI](https://ui.shadcn.com/) for beautiful components
- [Replit](https://replit.com/) for excellent development platform
- [Tailwind CSS](https://tailwindcss.com/) for styling framework

---

**Built with ❤️ using modern web technologies**

## Author

Miloni Patel 
@milonip
