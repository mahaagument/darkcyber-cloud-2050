
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { vaultAssistantChat } from '../services/geminiService';
import { ChatMessage } from '../types';

export const VaultAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'System online. I am your DarkCyber Vault Assistant. How can I secure your data today?', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const aiResponse = await vaultAssistantChat(history, input);
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: aiResponse || "Communication error.",
      timestamp: new Date()
    }]);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#080808] border-l border-white/5 w-80 shrink-0">
      <div className="p-4 border-bottom border-white/5 bg-[#0a0a0a]">
        <h3 className="text-xs font-bold text-[#bc13fe] tracking-widest uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#bc13fe] animate-pulse" />
          Vault Assistant
        </h3>
      </div>
      
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed ${
              m.role === 'user' 
                ? 'bg-[#bc13fe]/10 border border-[#bc13fe]/20 text-[#bc13fe]' 
                : 'bg-white/5 border border-white/10 text-gray-300'
            }`}>
              {m.content}
            </div>
            <span className="text-[9px] text-gray-600 mt-1 uppercase mono">
              {/* Fix: Corrected '2i' to '2-digit' for toLocaleTimeString options */}
              {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-[10px] text-[#bc13fe] mono animate-pulse">
            <span className="w-1 h-1 bg-[#bc13fe] rounded-full" />
            <span className="w-1 h-1 bg-[#bc13fe] rounded-full" />
            <span className="w-1 h-1 bg-[#bc13fe] rounded-full" />
            ANALYZING...
          </div>
        )}
      </div>

      <div className="p-4 bg-[#0a0a0a] border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query terminal..."
            className="flex-grow bg-[#050505] border border-white/10 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#bc13fe] transition-colors text-white"
          />
          <Button variant="secondary" size="sm" onClick={handleSend} loading={isLoading}>
            SEND
          </Button>
        </div>
      </div>
    </div>
  );
};
