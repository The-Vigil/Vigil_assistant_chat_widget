# AEGIS Vigil AI Assistant Chat Widget

This repository contains a frontend widget for VIIGIL AI-powered chatbot assistant. Built with React and integrated with RunPod's serverless infrastructure, this widget provides a seamless voice and text interaction experience. The assistant serves as a personal AI consultant, capable of handling voice input, providing text responses, and delivering natural voice responses.

## Screenshots

To give you a better idea of how the AI Assistant Chat Widget looks and functions, here are a few screenshots:

### Chat Interface
![Chat Interface](images/chat-interface.png)
![Chat Widget](images/floating-1.png)

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## Backend Integration
The frontend widget seamlessly integrates with a RunPod serverless backend. When a user sends a message (either text or voice), the widget securely transmits the request to the RunPod endpoint. The backend processes the request using:

- Voice transcription via Whisper for audio input
- LLaMA 70B model for natural language understanding and response generation
- OpenAI's TTS for converting responses to natural speech

To ensure a production-ready setup, the RunPod backend deployment features:
- Chunked processing for efficient audio handling
- Parallel processing of LLM and TTS requests
- Secure HTTPS communication with the frontend
- Automatic resource cleanup and memory management
- Error handling and recovery mechanisms

Backend repository: https://github.com/The-Vigil/Vigil_Assistant

You can access the RunPod serverless endpoints and documentation at https://www.runpod.io/console/serverless.

## Features
- 🎤 Voice Interaction
  - Real-time voice recording and transcription
  - Natural text-to-speech responses
  - Visual feedback during recording

- 💬 Advanced Chat Interface
  - Modern dark theme design
  - Smooth animations and transitions
  - Real-time response streaming
  - Message history with custom scrolling

- ⚡ Efficient Processing
  - Chunked audio processing
  - Parallel request handling
  - Optimized resource usage
  - Automatic cleanup

- 🎨 Rich UI Elements
  - Animated message bubbles
  - Loading indicators
  - Recording status feedback
  - Predefined quick actions

## Installation

1. Install the required dependencies:
```bash
npm install lucide-react
```

2. Create environment variables:
```env
NEXT_PUBLIC_RUNPOD_API_KEY=your_runpod_api_key
NEXT_PUBLIC_RUNPOD_ENDPOINT_ID=your_endpoint_id
```

3. Import and use the component:
```jsx
import FloatingChatWindow from './components/FloatingChatWindow';

function App() {
  return (
    <div>
      <FloatingChatWindow />
    </div>
  );
}
```

## Usage
The chat widget provides an intuitive interface for both voice and text interactions:

### Voice Input
1. Click the microphone button to start recording
2. Speak your message
3. Click stop when finished
4. The message will be transcribed and processed
5. Listen to the AI's voice response

### Text Input
1. Type your message in the input field
2. Press Enter or click Send
3. View the AI's response
4. Listen to the voice response

## Configuration
You can customize the widget's behavior by modifying the environment variables:

```env
NEXT_PUBLIC_RUNPOD_API_KEY=your_api_key
NEXT_PUBLIC_RUNPOD_ENDPOINT_ID=your_endpoint_id
```

Additional configuration options can be passed as props:
```jsx
<FloatingChatWindow 
  initialMessage="How can I help?"
  theme="dark"
  position="bottom-right"
/>
```

## Customization
The widget uses Tailwind CSS for styling and can be customized by:

1. Modifying the Tailwind config:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        chat: {
          bg: '#1a1b26',
          secondary: '#24283b',
          accent: '#414868',
        }
      },
      // ... animations config
    }
  }
}
```

2. Adding custom CSS classes
3. Modifying component props
4. Creating theme variations

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License
Private

