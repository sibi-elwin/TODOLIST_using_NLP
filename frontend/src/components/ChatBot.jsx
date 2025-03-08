import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaMicrophone, FaMicrophoneSlash, FaGlobe } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const SUPPORTED_LANGUAGES = [
  { code: 'ta-IN', name: 'தமிழ் (Tamil)', nativeName: 'தமிழ்' },
  { code: 'en-US', name: 'English (US)', nativeName: 'English' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'ru-RU', name: 'Russian' }
];

const TAMIL_SUGGESTIONS = [
  { text: "என் பணிகளை காட்டு", translation: "Show my tasks" },
  { text: "இன்றைய பணிகள் என்ன?", translation: "What are today's tasks?" },
  { text: "முக்கியமான பணிகளை காட்டு", translation: "Show important tasks" },
  { text: "அடுத்த வார பணிகள்", translation: "Next week's tasks" }
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your task assistant. I can help you manage your tasks and answer any questions about them!", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const languageMenuRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    try {
      // Add user message to chat
      setMessages(prev => [...prev, { text: inputMessage, isBot: false }]);
      setIsLoading(true);

      // Send message to backend
      const response = await axios.post(
        'http://localhost:3000/api/ai/api/user-tasks',
        { message: inputMessage },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract the AI response text from the Gemini API response
      const aiResponseText = response.data.response.candidates[0].content.parts[0].text;

      // Add AI response to chat
      setMessages(prev => [...prev, { text: aiResponseText, isBot: true }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response from AI assistant');
      setMessages(prev => [...prev, { 
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
      setInputMessage('');
    }
  };

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return null;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = selectedLanguage;

    return recognition;
  };

  const startListening = async () => {
    try {
      const permission = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (!recognitionRef.current) {
        recognitionRef.current = initializeSpeechRecognition();
      } else {
        recognitionRef.current.lang = selectedLanguage;
      }

      if (!recognitionRef.current) {
        return;
      }

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        toast.info(`Listening in ${SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage).name}...`, 
          { autoClose: 2000 });
      };

      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        toast.success('Voice captured!', { autoClose: 2000 });

        // If language is not English, translate to English before sending to backend
        if (selectedLanguage !== 'en-US') {
          try {
            const response = await axios.post('http://localhost:3000/api/translate', {
              text: transcript,
              from: selectedLanguage.split('-')[0],
              to: 'en'
            });
            setInputMessage(response.data.translatedText);
        } catch (error) {
            console.error('Translation error:', error);
            toast.warning('Could not translate input, sending original text');
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error(`Voice recognition failed: ${event.error}`);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error('Microphone access error:', error);
      toast.error('Please allow microphone access to use voice input');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Function to handle Tamil text input
  const handleTamilInput = async (text) => {
    try {
      // First, translate Tamil to English for processing
      const response = await axios.post('http://localhost:3000/api/translate', {
        text,
        from: 'ta',
        to: 'en'
      });

      // Add both Tamil and English versions to the chat
      setMessages(prev => [...prev, {
        text,
        translation: response.data.translatedText,
        isBot: false,
        language: 'ta-IN'
      }]);

      // Process the translated text with your AI
      handleAIResponse(response.data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('மொழிபெயர்ப்பில் பிழை ஏற்பட்டது', { // Translation error occurred
        position: "top-right"
      });
    }
  };

  // Handle AI response with Tamil translation
  const handleAIResponse = async (englishText) => {
    try {
      const aiResponse = await axios.post(
        'http://localhost:3000/api/ai/user-tasks',
        { message: englishText },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // If user selected Tamil, translate the response back to Tamil
      if (selectedLanguage === 'ta-IN') {
        const tamilResponse = await axios.post('http://localhost:3000/api/translate', {
          text: aiResponse.data.response.candidates[0].content.parts[0].text,
          from: 'en',
          to: 'ta'
        });

        setMessages(prev => [...prev, {
          text: tamilResponse.data.translatedText,
          translation: aiResponse.data.response.candidates[0].content.parts[0].text,
          isBot: true,
          language: 'ta-IN'
        }]);
      } else {
        setMessages(prev => [...prev, {
          text: aiResponse.data.response.candidates[0].content.parts[0].text,
          isBot: true,
          language: 'en-US'
        }]);
      }
    } catch (error) {
      console.error('AI response error:', error);
      toast.error('பதிலளிப்பதில் பிழை ஏற்பட்டது', { // Error in getting response
        position: "top-right"
      });
    }
  };

  // Render message with translation if available
  const renderMessage = (message) => (
    <div className={`max-w-[80%] p-3 rounded-lg ${
      message.isBot ? 'bg-gray-700' : 'bg-indigo-600'
    }`}>
      <div className="text-white">{message.text}</div>
      {message.translation && (
        <div className="text-gray-400 text-sm mt-1 border-t border-gray-600 pt-1">
          {message.translation}
        </div>
      )}
    </div>
  );

    return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaRobot className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-20 right-0 w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700"
        >
          {/* Chat Header with Language Selection */}
          <div className="p-4 border-b border-gray-700 flex items-center">
            <div className="flex items-center gap-3">
              <FaRobot className="w-6 h-6 text-indigo-400" />
              <h3 className="text-white font-semibold">
                {selectedLanguage === 'ta-IN' ? 'பணி உதவியாளர்' : 'Task Assistant'}
              </h3>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                {renderMessage(message)}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-700 text-white p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
                    </div>

          {/* Tamil Quick Suggestions */}
          {selectedLanguage === 'ta-IN' && (
            <div className="p-2 border-t border-gray-700">
              <div className="flex flex-wrap gap-2">
                {TAMIL_SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleTamilInput(suggestion.text)}
                    className="text-sm bg-gray-700 text-white px-3 py-1 rounded-full hover:bg-gray-600"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
                <input
                    type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={selectedLanguage === 'ta-IN' ? 
                  "உங்கள் கேள்வியை தட்டச்சு செய்யவும்..." : 
                  "Type your message..."
                }
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading || isListening}
              />
              
              <div className="relative" ref={languageMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <FaGlobe className="w-5 h-5" />
                </button>

                {showLanguageMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full right-0 mb-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-60 overflow-y-auto"
                  >
                    {SUPPORTED_LANGUAGES.map((language) => (
                      <button
                        key={language.code}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(language.code);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                          selectedLanguage === language.code ? 'bg-indigo-600' : ''
                        }`}
                      >
                        <span className="text-white">{language.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                disabled={isLoading}
              >
                {isListening ? (
                  <FaMicrophoneSlash className="w-5 h-5 animate-pulse" />
                ) : (
                  <FaMicrophone className="w-5 h-5" />
                )}
              </button>

              <button
                type="submit"
                className={`bg-indigo-600 text-white p-2 rounded-lg transition-colors ${
                  isLoading || isListening ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                }`}
                disabled={isLoading || isListening}
              >
                <FaPaperPlane className="w-5 h-5" />
                </button>
            </div>
          </form>
        </motion.div>
      )}
        </div>
    );
};

export default ChatBot;