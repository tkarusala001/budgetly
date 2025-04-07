"use client";
import React, { useState, useRef, useEffect } from 'react';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Bot, X, Sparkles, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

const AIChat = () => {
  // Initial message with the original welcome message
  const INITIAL_MESSAGE = {
    role: 'assistant', 
    content: 'Hi there! I am the Budgetly AI assistant. How can I help you learn more about our financial management app?'
  };

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const chatEndRef = useRef(null);

  // Predefined context about Budgetly
  const BUDGETLY_CONTEXT = `
You are an AI assistant for Budgetly, a comprehensive financial management app. 

App Overview:
- Budgetly helps users track expenses, manage budgets, and monitor income streams
- Provides clear insights into spending habits
- Supports multiple income sources
- Fully responsive web application

Key Features:
1. Budget Creation
- Users can create budgets with names, amounts, and emoji icons
- Track expenses within specific budget categories
- Visual progress bars show budget progress

2. Income Tracking
- Add multiple income sources 
- Specify name, amount, and emoji for each income stream
- Easy to manage and track different revenue channels

3. Expense Management
- Add expenses with details like amount, date, and description
- View spending history for each budget
- Monitor progress against budget limits

4. User Experience
- Intuitive, user-friendly interface
- No automatic notifications (current version)
- Fully responsive design works on mobile devices

5. Deletion Capabilities
- Can delete budgets and income sources
- Trash icon on each card for removal
- Confirmation required to prevent accidental deletions

Limitations:
- No mobile app (web app is mobile-responsive)
- No automatic spending notifications
- Manual tracking and management

Contact Support: support@budgetly.com
`;

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"});

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessages = [
      ...messages, 
      { role: 'user', content: inputMessage }
    ];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare prompt with context
      const prompt = `
${BUDGETLY_CONTEXT}

User Question: ${inputMessage}

Please provide a helpful, specific, and concise answer based on the Budgetly app context. If the question is not directly related to Budgetly, politely explain that.
      `;

      // Generate AI response
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Add AI response to messages
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: text }
      ]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      
      // More detailed error logging
      let errorMessage = "I'm sorry, there was an error processing your request. ";
      
      if (error.message) {
        errorMessage += `Error details: ${error.message}`;
        console.log("Error message:", error.message);
      }
      
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          role: 'assistant', 
          content: errorMessage
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // New method to clear conversation history
  const handleClearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
    setIsAlertOpen(false);
  };

  // Render chat button or chat window based on state
  if (!isChatOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsChatOpen(true)}
          className="w-24 h-24 rounded-full bg-blue-600 from-primary to-primary/80 hover:bg-blue-500 text-white shadow-xl shadow-primary/30 transform transition-all hover:scale-105 flex flex-col items-center justify-center p-0"
        >
          <Bot size={32} className="mb-0.5" />
          <span className="text-[12px] text-center leading-tight">
            Talk to<br />BudgetlyAI
          </span>
        </Button>
      </div>
    );
  }
  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="h-[600px] flex flex-col shadow-2xl shadow-primary/10 border-2 border-primary/10 rounded-2xl overflow-hidden">
        {/* Header with gradient and logo */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Bot size={24} className="text-white" />
            <h3 className="text-lg font-bold">BudgetlyAI</h3>
          </div>
          <div className="flex items-center space-x-2">
            {/* Add Clear History Alert Dialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsAlertOpen(true)}
                >
                  <Trash2 size={20} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Conversation History?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all messages except the initial welcome message. 
                    Are you sure you want to clear the conversation?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearHistory}>
                    Clear History
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Chat Content */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex items-start space-x-2 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="bg-white p-2 rounded-full shadow-md">
                  <Bot size={20} className="text-primary" />
                </div>
              )}
              <div 
                className={`p-3 rounded-2xl max-w-[280px] shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-center space-x-2">
              <div className="bg-white p-2 rounded-full shadow-md">
                <Bot size={20} className="text-primary" />
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-md relative">
                <div className="typing-indicator flex space-x-1">
                  <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </CardContent>

        {/* Input Area */}
        <CardFooter className="border-t border-gray-100 p-4 bg-white">
          <div className="flex space-x-2 w-full">
            <Input 
              placeholder="Ask about Budgetly..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border-primary/30 focus:ring-2 focus:ring-primary/50 rounded-full"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isLoading}
              className="rounded-full bg-primary hover:bg-primary/90 transition-all"
              size="icon"
            >
              <Send size={20} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIChat;