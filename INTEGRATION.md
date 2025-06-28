# Voice Assistant Integration Guide

This project integrates a Next.js frontend with a Python Flask backend for voice recognition, conversation processing, and text-to-speech functionality.

## Architecture

- **Frontend**: Next.js with TypeScript, Tailwind CSS, and Zustand for state management
- **Backend**: Python Flask API with LangChain, Groq LLM, Whisper for speech-to-text, and pyttsx3 for text-to-speech

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- Python (3.8 or higher)
- pnpm (or npm/yarn)

### Frontend Setup

1. Install frontend dependencies:
```bash
pnpm install
```

2. Create frontend environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your configuration:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### Backend Setup

#### Option 1: Using Setup Script (Windows)
```bash
# Run the Windows setup script
npm run setup:backend:windows
```

#### Option 2: Using Setup Script (Unix/Linux/macOS)
```bash
# Make script executable and run
chmod +x setup-backend.sh
npm run setup:backend
```

#### Option 3: Manual Setup
```bash
# Create virtual environment
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Unix/Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

### Environment Configuration

Update `backend/.env` with your API keys:
```
GROQ_API_KEY=your_groq_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

## Running the Application

### Option 1: Run Both Frontend and Backend Together
```bash
pnpm run dev:all
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
pnpm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
pnpm run dev
```

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /health` - Health check
- `POST /api/transcribe` - Convert audio to text
- `POST /api/conversation` - Process conversation with LLM
- `POST /api/speak` - Convert text to speech
- `POST /api/grammar-check` - Check grammar of text

## Features

### Speech Recognition
- Web Speech API (browser native) for real-time recognition
- Fallback to MediaRecorder + Whisper backend for better accuracy
- Automatic transcription and conversation processing

### Conversation Processing
- LangChain integration with Groq LLM (Llama3-70B)
- Grammar checking with LanguageTool
- Context-aware responses

### Text-to-Speech
- Browser-based playback of AI responses
- Backend TTS generation using pyttsx3

### Frontend Features
- Real-time voice animation
- Message history
- Responsive design with dark/light theme
- Authentication system
- Typewriter text effects

## File Structure

```
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── conversation/      # Main conversation interface
│   └── layout.tsx         # Root layout
├── backend/               # Python Flask backend
│   ├── app.py            # Main Flask application
│   ├── grammar_checker.py # Grammar checking tool
│   ├── speechToText.py   # Speech recognition
│   ├── textToSpeech.py   # Text-to-speech
│   └── requirements.txt  # Python dependencies
├── components/           # React components
├── hooks/               # Custom React hooks
├── lib/                # Utilities and API client
│   ├── api-client.ts   # Backend API integration
│   └── store.ts        # Zustand state management
└── public/             # Static assets
```

## Development Notes

### Adding New Backend Endpoints
1. Add endpoint in `backend/app.py`
2. Add corresponding method in `lib/api-client.ts`
3. Update frontend components to use new functionality

### State Management
- Authentication: `useAuthStore`
- Voice state: `useVoiceStore` 
- Theme: `useThemeStore`

### Error Handling
- Backend errors are logged and returned as JSON
- Frontend displays user-friendly error messages
- Automatic retry logic for failed requests

## Troubleshooting

### Common Issues

1. **Backend not starting**: Check Python version and virtual environment activation
2. **CORS errors**: Ensure backend is running on port 5000 and frontend on 3000
3. **Microphone not working**: Check browser permissions for microphone access
4. **API key errors**: Verify GROQ_API_KEY in backend/.env file

### Dependencies Issues

If you encounter issues with Python packages:
```bash
# Reinstall requirements
pip install --force-reinstall -r backend/requirements.txt
```

If you encounter issues with Node packages:
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

## License

This project is for educational purposes. Please ensure you have appropriate licenses for all dependencies and API services used.
