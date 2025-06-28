# Troubleshooting Guide: Speech Recognition Not Working

## Common Issues and Solutions

### 1. Backend Not Starting/Working

**Check if backend is running:**
```bash
curl http://localhost:5000/health
# or open http://localhost:5000/health in browser
```

**Expected response:**
```json
{"status": "healthy", "message": "Voice Assistant API is running"}
```

**If backend not working:**
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Unix/Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

### 2. Environment Variables Missing

**Check if GROQ_API_KEY is set:**
```bash
# In backend/.env file
GROQ_API_KEY=your_actual_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

**Get GROQ API Key:**
1. Go to https://console.groq.com
2. Sign up/login
3. Create API key
4. Add to backend/.env

### 3. Frontend-Backend Connection Issues

**Check browser console for errors:**
- Open Developer Tools (F12)
- Look for network errors
- Check if API calls are reaching backend

**Common CORS/Connection errors:**
- Backend must run on port 5000
- Frontend must run on port 3000
- Check firewall settings

### 4. Speech Recognition Issues

**Browser Support:**
- Use Chrome, Edge, or Safari
- Requires HTTPS in production
- Check microphone permissions

**Debug Speech Recognition:**
Open browser console and look for debug logs:
```
Starting to listen...
Using Web Speech API
Speech recognition result: {...}
Final transcript received: "hello world"
Processing user input: hello world
Sending to backend: hello world
Backend response: {...}
```

### 5. Common Error Messages

**"Backend is not responding"**
- Backend server not running
- Wrong port or URL
- Firewall blocking connection

**"Error accessing microphone"**
- Browser permissions denied
- Microphone not available
- HTTPS required for production

**"Import error" in backend**
- Missing Python packages
- Virtual environment not activated
- Python version incompatible

### 6. Quick Test Commands

**Test frontend-backend connection:**
```javascript
// In browser console
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(console.log)
```

**Test speech recognition manually:**
```javascript
// In browser console
navigator.mediaDevices.getUserMedia({audio: true})
  .then(() => console.log('Microphone access granted'))
  .catch(console.error)
```

**Test backend API manually:**
```bash
# Test conversation endpoint
curl -X POST http://localhost:5000/api/conversation \
  -H "Content-Type: application/json" \
  -d '{"text": "hello world"}'
```

### 7. Step-by-Step Debugging

1. **Start backend first:**
   ```bash
   cd backend
   python app.py
   ```
   Should show: `Running on http://0.0.0.0:5000`

2. **Test backend health:**
   Open http://localhost:5000/health

3. **Start frontend:**
   ```bash
   npm run dev
   ```

4. **Open frontend:**
   Open http://localhost:3000

5. **Check browser console:**
   Look for debug messages and errors

6. **Try speaking:**
   Click start, speak clearly, check console logs

### 8. Production Issues

**HTTPS Required:**
- Speech recognition requires HTTPS in production
- Use ngrok for testing: `ngrok http 3000`

**API Keys:**
- Use environment variables
- Don't commit API keys to git
- Use different keys for dev/prod

### 9. Alternative Testing

**Manual text input (for testing without speech):**
```javascript
// Add this to conversation page for testing
const testBackend = async () => {
  try {
    const response = await apiClient.processConversation("test message");
    console.log("Backend test successful:", response);
  } catch (error) {
    console.error("Backend test failed:", error);
  }
};
```

**Browser speech test:**
```javascript
// Test Web Speech API
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.onresult = (event) => {
  console.log("Speech result:", event.results[0][0].transcript);
};
recognition.start();
```

### 10. Getting Help

If issues persist:
1. Check browser console for errors
2. Check backend terminal for errors
3. Verify all environment variables are set
4. Test with minimal example
5. Check network connectivity

**Debug panel** is temporarily added to the frontend to show real-time status.
