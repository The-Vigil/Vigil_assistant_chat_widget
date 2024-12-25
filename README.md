# Vigil Chatbot Frontend Widget

This repository contains the frontend widget for Vigil's AI-powered chatbot, AEGIS (Autonomous Enhanced Guidance and Intelligent Support). AEGIS serves as Vigil's dedicated Property Protection Consultant, assisting users with property protection inquiries and providing general guidance about Vigil's digital verification system.

## Screenshots

To give you a better idea of how the Vigil Chatbot Widget looks and functions, here are a few screenshots:

### Chat Interface
![Chat Interface](images/chat-interface.png)

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## Backend Integration
The frontend widget seamlessly integrates with the AEGIS backend hosted on Runpod. When a user sends a message, the widget securely transmits the request to the backend API endpoint. The backend processes the request using natural language understanding models, generates an appropriate response based on Vigil's proprietary knowledge base, and sends the response back to the widget for display.
To ensure a production-ready setup, the Runpod backend deployment features:

Autoscaling to handle variable traffic loads
Monitoring and logging for performance insights
Secure HTTPS communication with the frontend
Regular backups and disaster recovery measures
https://github.com/The-Vigil/Vigil_Assistant
You can access the backend API documentation and test out requests at https://www.runpod.io/console/serverless.

## Features
- Instant access to AEGIS, Vigil's AI Property Protection Consultant
- Real-time chat interface for seamless user interaction
- Customizable appearance to match your website's branding
- Lightweight and easily embeddable in any web page
- Secure communication with Vigil's backend services
- Supports multiple languages (English, Spanish, French, German, Italian)

## Installation
To add the Vigil Chatbot Widget to your website, follow these steps:

1. Include the following script tag in your HTML file, just before the closing `</body>` tag:

   ```html
   <script src="https://cdn.vigil.ai/chatbot/widget.js" async defer></script>
   ```

2. Add the `vigil-chatbot` container element where you want the widget to appear:

   ```html
   <div id="vigil-chatbot"></div>
   ```

3. Optionally, you can pass configuration options to customize the widget's behavior and appearance (see [Configuration](#configuration)).

## Usage
Once installed, the Vigil Chatbot Widget will automatically load on your web page. Users can interact with AEGIS by clicking on the chatbot icon in the bottom-right corner of the screen. This will open the chat interface where users can type their questions and receive instant responses from AEGIS.

The widget provides a user-friendly interface with features such as:
- Typing indicators to show when AEGIS is processing a request
- Persistent conversation history across sessions
- Options to minimize or close the chat window
- Buttons for common queries and quick replies

## Configuration
The Vigil Chatbot Widget can be customized using configuration options. To set these options, add a `vigil-chatbot-config` object to your page before loading the widget script:

```html
<script>
  window.vigilChatbotConfig = {
    // Configuration options go here
    backgroundColor: '#F0F0F0',
    ctaText: 'Ask AEGIS',
    // ...
  };
</script>
```

Available configuration options include:
- `backgroundColor`: The background color of the chat window (default: `'#FFFFFF'`)
- `ctaText`: The text displayed on the main call-to-action button (default: `'Chat with AEGIS'`)
- `welcomeMessage`: The initial message shown when a user opens the chat (default: `'Hello! How can I assist you today?'`) 
- `language`: The default language for AEGIS responses (default: `'en'`)
- ... 

See the [Configuration Guide](docs/configuration.md) for a complete list of options and details on how to use them.

## Customization
In addition to configuration options, the appearance of the Vigil Chatbot Widget can be extensively customized using CSS. The widget's elements use BEM-style class names, making it easy to target specific parts of the UI.

To apply your own styles, simply add a `<style>` block or link an external stylesheet after the widget script:

```html
<link rel="stylesheet" href="/path/to/your/chatbot-styles.css">
```

Refer to the [Customization Guide](docs/customization.md) for a full list of CSS classes and customization examples.

## Contributing
We welcome contributions to improve the Vigil Chatbot Widget! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit bug reports, suggest new features, or open pull requests.

## License
Private
