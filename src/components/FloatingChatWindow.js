
// import React, { useState, useRef, useEffect } from 'react';
// import { MessageSquare, X, Send, Mic, StopCircle } from 'lucide-react';

// const FloatingChatWindow = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const mediaRecorderRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   const RUNPOD_API_KEY = "rpa_FPNCUWFPY14G8PANB49TVYLJX4NAEAZGMU5PQGZ81ssmlf";
//   const ENDPOINT_ID = "y4vntzd46qr3lm";

//   useEffect(() => {
//     if (isOpen && messages.length === 0) {
//       setMessages([
//         {
//           type: 'assistant',
//           text: "Hi! I'm Sayed's AI assistant. How can I help you today?",
//         }
//       ]);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       const audioChunks = [];

//       mediaRecorder.ondataavailable = (event) => {
//         audioChunks.push(event.data);
//       };

//       mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//         await processAudioInput(audioBlob);
//       };

//       mediaRecorderRef.current = mediaRecorder;
//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Error accessing microphone:', error);
//       setMessages(prev => [...prev, {
//         type: 'error',
//         text: 'Error accessing microphone. Please ensure microphone permissions are enabled.'
//       }]);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//       mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
//     }
//   };

//   const blobToBase64 = (blob) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result
//           .replace('data:audio/wav;base64,', '')
//           .replace('data:audio/webm;base64,', '');
//         resolve(base64String);
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   };

//   const base64ToBlob = (base64) => {
//     const binaryString = window.atob(base64);
//     const bytes = new Uint8Array(binaryString.length);
//     for (let i = 0; i < binaryString.length; i++) {
//       bytes[i] = binaryString.charCodeAt(i);
//     }
//     return new Blob([bytes], { type: 'audio/wav' });
//   };
//   const processAudioInput = async (blob) => {
//     setIsLoading(true);
//     try {
//       const base64Audio = await blobToBase64(blob);
      
//       // Show processing message
//       setMessages(prev => [...prev, {
//         type: 'system',
//         text: "Processing your voice message..."
//       }]);

//       // Send to RunPod
//       console.log("Sending audio to RunPod...");
//       const response = await callRunPodEndpoint({
//         type: 'audio',
//         audio: base64Audio
//       });
//       console.log("RunPod Response:", response);

//       // Remove processing message
//       setMessages(prev => prev.filter(msg => msg.text !== "Processing your voice message..."));

//       // Handle transcription and user message
//       if (response?.output?.user_input?.text) {  // Changed from transcription to text
//         setMessages(prev => [...prev, {
//           type: 'user',
//           text: response.output.user_input.text  // Changed path to match handler response
//         }]);
//       }

//       // Handle assistant response
//       if (response?.output?.assistant_response) {
//         setMessages(prev => [...prev, {
//           type: 'assistant',
//           text: response.output.assistant_response.text
//         }]);

//         // Play audio response
//         if (response.output.assistant_response.audio) {
//           const audioData = base64ToBlob(response.output.assistant_response.audio);
//           const audioUrl = URL.createObjectURL(audioData);
//           const audio = new Audio(audioUrl);
//           await audio.play();
//           URL.revokeObjectURL(audioUrl); // Cleanup
//         }
//       }
//     } catch (error) {
//       console.error('Error processing audio:', error);
//       setMessages(prev => prev.filter(msg => msg.text !== "Processing your voice message..."));
//       setMessages(prev => [...prev, {
//         type: 'error',
//         text: 'Sorry, there was an error processing your audio.'
//       }]);
//     }
//     setIsLoading(false);
// };



//   const callRunPodEndpoint = async (payload) => {
//     try {
//       console.log("Sending payload to RunPod:", payload);
//       const response = await fetch(`https://api.runpod.ai/v2/${ENDPOINT_ID}/run`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${RUNPOD_API_KEY}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ input: payload })
//       });

//       if (!response.ok) {
//         throw new Error(`API request failed with status ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Initial RunPod response:", data);
//       return await pollForCompletion(data.id);
//     } catch (error) {
//       console.error('Error calling RunPod:', error);
//       throw error;
//     }
//   };

//   const pollForCompletion = async (jobId) => {
//     const maxAttempts = 30;
//     const delayMs = 1000;
    
//     for (let attempt = 0; attempt < maxAttempts; attempt++) {
//       try {
//         const response = await fetch(
//           `https://api.runpod.ai/v2/${ENDPOINT_ID}/status/${jobId}`,
//           {
//             headers: {
//               'Authorization': `Bearer ${RUNPOD_API_KEY}`
//             }
//           }
//         );
        
//         if (!response.ok) {
//           throw new Error(`Status check failed with status ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log(`Poll attempt ${attempt + 1}:`, data);
        
//         if (data.status === 'COMPLETED') {
//           return data; // Return the complete data object
//         } else if (data.status === 'FAILED') {
//           throw new Error(data.error);
//         }
        
//         await new Promise(resolve => setTimeout(resolve, delayMs));
//       } catch (error) {
//         console.error(`Error in poll attempt ${attempt + 1}:`, error);
//         throw error;
//       }
//     }
    
//     throw new Error('Job timed out');
//   };

//   const handleSendMessage = async () => {
//     if (!inputText.trim()) return;

//     const userMessage = inputText.trim();
//     setInputText('');
//     setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
//     setIsLoading(true);

//     try {
//       const response = await callRunPodEndpoint({
//         type: 'text',
//         text: userMessage
//       });

//       if (response?.output?.assistant_response) {
//         setMessages(prev => [...prev, {
//           type: 'assistant',
//           text: response.output.assistant_response.text
//         }]);

//         if (response.output.assistant_response.audio) {
//           const audioData = base64ToBlob(response.output.assistant_response.audio);
//           const audioUrl = URL.createObjectURL(audioData);
//           const audio = new Audio(audioUrl);
//           await audio.play();
//           URL.revokeObjectURL(audioUrl);
//         }
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setMessages(prev => [...prev, {
//         type: 'error',
//         text: 'Sorry, there was an error processing your message.'
//       }]);
//     }
//     setIsLoading(false);
//   };

//   const predefinedQuestions = [
//     "Tell me about Sayed's background",
//     "What are Sayed's main projects?",
//     "What technologies does Sayed work with?"
//   ];

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {!isOpen ? (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all duration-200"
//         >
//           <MessageSquare className="w-6 h-6" />
//         </button>
//       ) : (
//         <div className="bg-[#1a1b26] rounded-lg shadow-xl w-96 max-h-[600px] flex flex-col">
//           {/* Header */}
//           <div className="bg-[#24283b] text-white p-4 rounded-t-lg flex justify-between items-center">
//             <h3 className="font-semibold">Chat with Sayed's Assistant</h3>
//             <button onClick={() => setIsOpen(false)} className="hover:bg-[#414868] rounded-full p-1">
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div
//                   className={`max-w-[80%] p-3 rounded-lg ${
//                     message.type === 'user'
//                       ? 'bg-blue-600 text-white'
//                       : message.type === 'error'
//                       ? 'bg-red-500 text-white'
//                       : message.type === 'system'
//                       ? 'bg-[#414868] text-gray-300 italic'
//                       : 'bg-[#24283b] text-white'
//                   }`}
//                 >
//                   {message.text}
//                 </div>
//               </div>
//             ))}
//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="bg-[#24283b] text-white p-3 rounded-lg animate-pulse">
//                   Processing...
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Predefined Questions */}
//           {messages.length === 1 && (
//             <div className="p-4 border-t border-[#24283b]">
//               <p className="text-sm text-gray-400 mb-2">Suggested questions:</p>
//               <div className="flex flex-wrap gap-2">
//                 {predefinedQuestions.map((question, index) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       setInputText(question);
//                       handleSendMessage();
//                     }}
//                     className="bg-[#24283b] hover:bg-[#414868] text-white text-sm px-3 py-1 rounded-full transition-colors"
//                   >
//                     {question}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Input */}
//           <div className="p-4 border-t border-[#24283b]">
//             <div className="flex items-center space-x-2">
//               <input
//                 type="text"
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                 placeholder="Type your message..."
//                 className="flex-1 bg-[#24283b] text-white border border-[#414868] rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 placeholder-gray-400"
//               />
//               <button
//                 onClick={isRecording ? stopRecording : startRecording}
//                 className={`p-2 rounded-full ${
//                   isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
//                 } text-white`}
//               >
//                 {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
//               </button>
//               <button
//                 onClick={handleSendMessage}
//                 disabled={!inputText.trim()}
//                 className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </div>
//             {isRecording && (
//               <div className="text-red-400 text-sm mt-2 animate-pulse text-center">
//                 Recording... Click stop when finished.
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FloatingChatWindow;






import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, StopCircle } from 'lucide-react';

const FloatingChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const messagesEndRef = useRef(null);

//   const RUNPOD_API_KEY = "rpa_FPNCUWFPY14G8PANB49TVYLJX4NAEAZGMU5PQGZ81ssmlf";
//   const ENDPOINT_ID = "y4vntzd46qr3lm";
  const RUNPOD_API_KEY = process.env.REACT_APP_RUNPOD_API_KEY;
  const ENDPOINT_ID = process.env.REACT_APP_ENDPOINT_ID;



  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: 'assistant',
          text: "Hi! I'm AEGIS Vigil's AI Property Protection Consultant AI assistant. How can I help you today?",
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processAudioInput(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        text: 'Error accessing microphone. Please ensure microphone permissions are enabled.'
      }]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result
          .replace('data:audio/wav;base64,', '')
          .replace('data:audio/webm;base64,', '');
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const base64ToBlob = (base64) => {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: 'audio/wav' });
  };
  const processAudioInput = async (blob) => {
    setIsLoading(true);
    try {
      const base64Audio = await blobToBase64(blob);
      
      // Show processing message
      setMessages(prev => [...prev, {
        type: 'system',
        text: "Processing your voice message..."
      }]);

      // Send to RunPod
      console.log("Sending audio to RunPod...");
      const response = await callRunPodEndpoint({
        type: 'audio',
        audio: base64Audio
      });
      console.log("RunPod Response:", response);

      // Remove processing message
      setMessages(prev => prev.filter(msg => msg.text !== "Processing your voice message..."));

      // Handle transcription and user message
      if (response?.output?.user_input?.text) {  // Changed from transcription to text
        setMessages(prev => [...prev, {
          type: 'user',
          text: response.output.user_input.text  // Changed path to match handler response
        }]);
      }

      // Handle assistant response
      if (response?.output?.assistant_response) {
        setMessages(prev => [...prev, {
          type: 'assistant',
          text: response.output.assistant_response.text
        }]);

        // Play audio response
        if (response.output.assistant_response.audio) {
          const audioData = base64ToBlob(response.output.assistant_response.audio);
          const audioUrl = URL.createObjectURL(audioData);
          const audio = new Audio(audioUrl);
          await audio.play();
          URL.revokeObjectURL(audioUrl); // Cleanup
        }
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      setMessages(prev => prev.filter(msg => msg.text !== "Processing your voice message..."));
      setMessages(prev => [...prev, {
        type: 'error',
        text: 'Sorry, there was an error processing your audio.'
      }]);
    }
    setIsLoading(false);
};



  const callRunPodEndpoint = async (payload) => {
    try {
      console.log("Sending payload to RunPod:", payload);
      const response = await fetch(`https://api.runpod.ai/v2/${ENDPOINT_ID}/run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RUNPOD_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input: payload })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Initial RunPod response:", data);
      return await pollForCompletion(data.id);
    } catch (error) {
      console.error('Error calling RunPod:', error);
      throw error;
    }
  };

  const pollForCompletion = async (jobId) => {
    const maxAttempts = 30;
    const delayMs = 1000;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(
          `https://api.runpod.ai/v2/${ENDPOINT_ID}/status/${jobId}`,
          {
            headers: {
              'Authorization': `Bearer ${RUNPOD_API_KEY}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Status check failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Poll attempt ${attempt + 1}:`, data);
        
        if (data.status === 'COMPLETED') {
          return data; // Return the complete data object
        } else if (data.status === 'FAILED') {
          throw new Error(data.error);
        }
        
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } catch (error) {
        console.error(`Error in poll attempt ${attempt + 1}:`, error);
        throw error;
      }
    }
    
    throw new Error('Job timed out');
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await callRunPodEndpoint({
        type: 'text',
        text: userMessage
      });

      if (response?.output?.assistant_response) {
        setMessages(prev => [...prev, {
          type: 'assistant',
          text: response.output.assistant_response.text
        }]);

        if (response.output.assistant_response.audio) {
          const audioData = base64ToBlob(response.output.assistant_response.audio);
          const audioUrl = URL.createObjectURL(audioData);
          const audio = new Audio(audioUrl);
          await audio.play();
          URL.revokeObjectURL(audioUrl);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        text: 'Sorry, there was an error processing your message.'
      }]);
    }
    setIsLoading(false);
  };

const predefinedQuestions = [
    "Tell me about Vigil's digital verification system ",
    "What is Vigil's core service offering?",
    "What should I do if there is an immediate threat to my property?"
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`transition-all duration-300 ease-in-out transform ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      }`}>
        {isOpen && (
          <div className="bg-[#1a1b26] rounded-lg shadow-xl w-96 max-h-[600px] flex flex-col animate-slideUp">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-[#24283b] to-[#1a1b26] text-white p-4 rounded-t-lg flex justify-between items-center border-b border-[#414868]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <h3 className="font-semibold">Chat with  AEGIS  Vigil's AI Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-[#414868] rounded-full p-1 transition-colors duration-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages with smooth scroll and fade */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] scrollbar-thin scrollbar-thumb-[#414868] scrollbar-track-[#1a1b26]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg transform transition-all duration-200 hover:scale-[1.02] ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                        : message.type === 'error'
                        ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                        : message.type === 'system'
                        ? 'bg-[#414868] text-gray-300 italic'
                        : 'bg-gradient-to-r from-[#24283b] to-[#1a1b26] text-white'
                    } shadow-lg hover:shadow-xl`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-[#24283b] text-white p-3 rounded-lg flex items-center space-x-2">
                    <span>Processing</span>
                    <span className="flex space-x-1">
                      <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                      <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area with enhanced animations */}
            <div className="p-4 border-t border-[#24283b]">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-[#24283b] text-white border border-[#414868] rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              {isRecording && (
                <div className="text-red-400 text-sm mt-2 text-center">
                  <span className="animate-pulse flex items-center justify-center">
                    <span className="mr-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    Recording... Click stop when finished
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating button with pulse effect */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 hover:rotate-3 relative"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
        </button>
      )}
    </div>
  );
};

// Add these animations to your global CSS or tailwind.config.js
const styles = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  /* Custom Scrollbar */
  .scrollbar-thin {
    scrollbar-width: thin;
  }

  .scrollbar-thumb-[#414868]::-webkit-scrollbar-thumb {
    background-color: #414868;
    border-radius: 9999px;
  }

  .scrollbar-track-[#1a1b26]::-webkit-scrollbar-track {
    background-color: #1a1b26;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
`;

export default FloatingChatWindow;