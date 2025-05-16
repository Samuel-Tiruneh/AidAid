import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiSmile, FiX, FiMinimize, FiMaximize } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ChatSupport = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your support assistant. How can I help you today?", sender: "bot", time: new Date(), read: true }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFeature, setActiveFeature] = useState(null);
  const messagesEndRef = useRef(null);

  // Features menu items
  const features = [
    { id: 'faq', name: 'FAQ', icon: '📖' },
    { id: 'account', name: 'Account Help', icon: '👤' },
    { id: 'donations', name: 'Donations', icon: '💳' },
    { id: 'volunteer', name: 'Volunteering', icon: '🤝' },
  ];

  const commonEmojis = ['😀', '😊', '👍', '❤️', '🙏', '🎉', '🤔', '😢'];

  useEffect(() => {
    scrollToBottom();
    if (isOpen) {
      markMessagesAsRead();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const unread = messages.filter(msg => msg.sender === 'bot' && !msg.read).length;
      setUnreadCount(unread);
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const markMessagesAsRead = () => {
    setMessages(prev => prev.map(msg => 
      msg.sender === 'bot' && !msg.read ? { ...msg, read: true } : msg
    ));
  };

  const sendMessage = () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user", time: new Date(), read: true };
      setMessages([...messages, userMessage]);
      setInput("");

      simulateBotResponse();
    }
  };

  const simulateBotResponse = () => {
    setIsTyping(true);

    setTimeout(() => {
      let response;

      if (activeFeature) {
        switch(activeFeature) {
          case 'faq':
            response = "Here are our frequently asked questions:\n\n1. How do I reset my password?\n2. Where are you located?\n3. How can I volunteer?";
            break;
          case 'account':
            response = "For account help, please email support@example.com with your username.";
            break;
          case 'donations':
            response = "Donations can be made at our website: https://example.com/donate";
            break;
          case 'volunteer':
            response = "Volunteer applications are available here: https://example.com/volunteer";
            break;
          default:
            response = "Thanks for your message! How else can I assist you?";
        }
      } else {
        const botResponses = [
          "I understand. Let me check that for you.",
          "Thanks for sharing that information!",
          "Our team will get back to you shortly.",
          "Is there anything else I can help with?"
        ];
        response = botResponses[Math.floor(Math.random() * botResponses.length)];
      }

      setMessages(prev => [...prev, { text: response, sender: "bot", time: new Date(), read: isOpen }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFeatureSelect = (featureId) => {
    setActiveFeature(featureId);
    setMessages([...messages, {
      text: `I need help with ${features.find(f => f.id === featureId).name}`,
      sender: "user",
      time: new Date(),
      read: true
    }]);
    simulateBotResponse();
  };

  const addEmoji = (emoji) => {
    setInput(prev => prev + emoji);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileMessage = {
        type: 'file',
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        sender: "user",
        time: new Date(),
        read: true
      };
      setMessages([...messages, fileMessage]);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-80 bg-white rounded-2xl shadow-xl overflow-hidden border border-pink-200 ${isMinimized ? 'h-16' : ''}`}
        >
          <div 
            className="bg-pink-500 text-white p-3 flex justify-between items-center cursor-pointer"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div className="flex items-center">
              <FaRobot className="mr-2" />
              <h2 className="font-semibold">Support Assistant</h2>
            </div>
            <div className="flex items-center">
              <button 
                className="p-1 mr-1 text-white hover:bg-pink-600 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
              >
                {isMinimized ? <FiMaximize /> : <FiMinimize />}
              </button>
              <button 
                className="p-1 text-white hover:bg-pink-600 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <FiX />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="h-64 bg-pink-50 p-3 overflow-y-auto flex flex-col">
                {activeFeature && (
                  <div className="mb-3 p-2 bg-pink-100 text-pink-800 rounded-lg text-sm">
                    Currently assisting with: {features.find(f => f.id === activeFeature).name}
                    <button 
                      className="ml-2 text-pink-600 hover:text-pink-800"
                      onClick={() => setActiveFeature(null)}
                    >
                      (Change)
                    </button>
                  </div>
                )}
                
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`mb-3 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.type === 'file' ? (
                        <div className="bg-pink-500 text-white p-3 rounded-lg rounded-br-none max-w-xs">
                          <div className="font-medium">Sent file:</div>
                          <div>{message.name}</div>
                          <div className="text-xs opacity-80">{message.size}</div>
                        </div>
                      ) : (
                        <div 
                          className={`max-w-xs p-3 rounded-lg ${message.sender === "user" 
                            ? "bg-pink-500 text-white rounded-br-none" 
                            : "bg-white text-gray-800 rounded-bl-none shadow-sm"}`}
                        >
                          <p className="whitespace-pre-line">{message.text}</p>
                          <p className={`text-xs mt-1 ${message.sender === "user" ? "text-pink-100" : "text-gray-500"}`}>
                            {formatTime(message.time)}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <div className="flex justify-start mb-3">
                    <div className="bg-white p-3 rounded-lg rounded-bl-none shadow-sm">
                      <div className="flex items-center">
                        <div className="flex space-x-1 mr-2">
                          <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="text-sm text-gray-500">Assistant is typing</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {!activeFeature && (
                <div className="p-3 bg-pink-100 border-t border-pink-200">
                  <h3 className="text-sm font-medium text-pink-800 mb-2">How can we help?</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {features.map(feature => (
                      <button
                        key={feature.id}
                        onClick={() => handleFeatureSelect(feature.id)}
                        className="bg-white text-pink-700 p-2 rounded-lg text-sm hover:bg-pink-50 transition-colors flex items-center justify-center"
                      >
                        <span className="mr-1">{feature.icon}</span> {feature.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-3 bg-white border-t border-pink-200">
                <div className="flex flex-wrap gap-1 mb-2">
                  {commonEmojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="text-lg hover:bg-pink-100 rounded p-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload" className="text-pink-500 p-2 hover:bg-pink-100 rounded mr-2 cursor-pointer">
                    <FiPaperclip />
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 p-2 border border-pink-300 rounded-lg mr-2 focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
                    placeholder="Type a message..."
                    rows="1"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
                  >
                    <FiSend />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-pink-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center relative"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            markMessagesAsRead();
          }}
        >
          <FaRobot className="text-xl" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default ChatSupport;
