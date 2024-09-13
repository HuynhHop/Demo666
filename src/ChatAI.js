// src/ChatAI.js
import React from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const ChatAI = ({ messages, setMessages }) => {
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY; 

  const genAI = new GoogleGenerativeAI(API_KEY);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const safetySetting = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ];

  async function run(input) {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    
    try {
      const prompt = `${newMessages.map(m => m.text).join('\n')}`;
      const chatSession = model.startChat({
        generationConfig,
        safetySetting
      });
    
      const result = await chatSession.sendMessage(prompt);
      const botMessage = result.response.text();
      setMessages([...newMessages, { text: botMessage, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { text: 'Có lỗi xảy ra, vui lòng thử lại sau!', sender: 'bot' }]);
    }
  }

  return { run }; // Trả về hàm run để dùng trong Dictaphone
}

export default ChatAI;
