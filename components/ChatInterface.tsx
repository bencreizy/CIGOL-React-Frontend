import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessageToModel } from '../services/geminiService';

interface ChatInterfaceProps {
  category?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ category = "Science" }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: Message = {
      id: userMsgId,
      role: 'user',
      text: inputText,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    const imageToSend = selectedImage;
    setSelectedImage(null); 
    setIsLoading(true);

    const responseText = await sendMessageToModel(newUserMsg.text, imageToSend, category);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      text: responseText
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <style>{`
        .container { 
            position: relative; 
            width: 100%; 
            max-width: 1100px;
            height: 100%; 
            transition: 200ms; 
            margin: 0 auto;
        }

        #card {
          position: absolute; 
          inset: 0; 
          z-index: 0;
          display: flex; 
          justify-content: center; 
          align-items: center;
          border-radius: 20px; 
          transition: 700ms cubic-bezier(0.23, 1, 0.32, 1);
          /* Increased opacity by 10% (from 0.43 to 0.53) */
          background: rgba(0, 0, 0, 0.53);
          backdrop-filter: blur(1px);
          -webkit-backdrop-filter: blur(1px);
          border: 1px solid rgba(0, 255, 255, 0.05);
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.02);
          overflow: hidden;
        }

        /* Hover opacity (maintained at high level) */
        .container:hover #card,
        .container:active #card,
        .container:focus-within #card {
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-color: rgba(0, 255, 255, 0.15);
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.05);
        }

        .card-content { 
            position: relative; 
            width: 100%; 
            height: 100%; 
            transition: opacity 0.5s ease;
        }

        /* Increased content default opacity by 10% (from 0.7 to 0.8) */
        #card .card-content {
          opacity: 0.8;
        }
        .container:hover #card .card-content,
        .container:active #card .card-content,
        .container:focus-within #card .card-content {
          opacity: 1;
        }

        .cyber-lines span {
          position: absolute; 
          width: 100%; 
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.05), transparent);
          animation: lineGrow 3s linear infinite;
          pointer-events: none;
        }

        .cyber-lines span:nth-child(1) { top: 20%; animation-delay: 0s; }
        .cyber-lines span:nth-child(2) { top: 40%; animation-delay: 1s; }
        .cyber-lines span:nth-child(3) { top: 60%; animation-delay: 2s; }
        .cyber-lines span:nth-child(4) { top: 80%; animation-delay: 1.5s; }

        .scan-line {
          position: absolute; 
          inset: 0; 
          transform: translateY(-100%);
          background: linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.02), transparent);
          animation: scanMove 2s linear infinite;
          pointer-events: none;
        }

        .corner-elements span {
          position: absolute; 
          width: 10px; 
          height: 10px;
          border: 1px solid rgba(0, 255, 255, 0.1); 
          transition: 0.3s;
          pointer-events: none;
        }

        .corner-elements span:nth-child(1) { top: 10px; left: 10px; border-right: 0; border-bottom: 0; }
        .corner-elements span:nth-child(2) { top: 10px; right: 10px; border-left: 0; border-bottom: 0; }
        .corner-elements span:nth-child(3) { bottom: 10px; left: 10px; border-right: 0; border-top: 0; }
        .corner-elements span:nth-child(4) { bottom: 10px; right: 10px; border-left: 0; border-top: 0; }

        .container:hover .corner-elements span {
          border-color: rgba(0, 255, 255, 0.3);
        }

        .tracker:hover ~ #card { 
            background: rgba(0, 0, 0, 0.65);
            border-color: #00ffff;
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.1);
        }

        .canvas { 
            perspective: 800px; 
            inset: 0; 
            position: absolute; 
            display: grid; 
            grid-template-columns: repeat(5, 1fr); 
            grid-template-rows: repeat(5, 1fr); 
            z-index: 200; 
        }
        
        .tracker { width: 100%; height: 100%; z-index: 201; }

        .tr-1:hover ~ #card { transform: rotateX(15deg) rotateY(-8deg); }
        .tr-3:hover ~ #card { transform: rotateX(15deg) rotateY(0deg); }
        .tr-5:hover ~ #card { transform: rotateX(15deg) rotateY(8deg); }
        .tr-13:hover ~ #card { transform: rotateX(0deg) rotateY(0deg); }
        .tr-21:hover ~ #card { transform: rotateX(-15deg) rotateY(-8deg); }
        .tr-25:hover ~ #card { transform: rotateX(-15deg) rotateY(8deg); }

        @keyframes lineGrow { 0%, 100% { transform: scaleX(0); opacity: 0; } 50% { transform: scaleX(1); opacity: 1; } }
        @keyframes scanMove { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }

        .chat-content-scroll::-webkit-scrollbar { width: 4px; }
        .chat-content-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-content-scroll::-webkit-scrollbar-thumb { background: rgba(0, 255, 255, 0.2); border-radius: 2px; }
        
        @media (max-width: 768px) {
           .canvas {
              perspective: none;
           }
           #card {
              border-radius: 12px;
           }
        }
        
        .uiverse-button {
          color: rgba(255, 255, 255, 0.6) !important;
          border-color: rgba(0, 255, 255, 0.2) !important;
          background: transparent !important;
        }
        .uiverse-button:hover {
          color: #00ffff !important;
          border-color: #00ffff !important;
          background: rgba(0, 255, 255, 0.1) !important;
          text-shadow: 0 0 8px rgba(0, 255, 255, 0.5) !important;
        }
      `}</style>

      <div className="flex-grow mb-3 md:mb-5 min-h-0 relative flex justify-center items-center">
        <div className="container noselect">
          <div className="canvas">
            {[...Array(25)].map((_, i) => (
                <div key={i} className={`tracker tr-${i + 1}`}></div>
            ))}
            
            <div id="card">
              <div className="card-content">
                <div className="cyber-lines">
                  <span></span><span></span><span></span><span></span>
                </div>
                <div className="scan-line"></div>
                <div className="corner-elements">
                  <span></span><span></span><span></span><span></span>
                </div>

                <div className="relative z-10 w-full h-full flex flex-col gap-3 p-3 md:p-5 overflow-y-auto chat-content-scroll">
                    {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`max-w-[95%] md:max-w-[90%] py-2.5 px-4 rounded-xl leading-relaxed shadow-lg transition-transform duration-200 hover:scale-[1.01] ${
                        msg.role === 'user' 
                            ? 'self-end bg-[#3682f4]/90 text-white rounded-br-sm border border-[#3682f4]/30' 
                            : 'self-start bg-black/80 text-[#f0f0f0] rounded-bl-sm border border-[#00ffff]/20'
                        }`}
                    >
                        {msg.image && (
                        <img src={msg.image} alt="User attachment" className="max-w-full rounded mb-2 border border-white/20" />
                        )}
                        <div className="whitespace-pre-wrap text-sm md:text-base">{msg.text}</div>
                    </div>
                    ))}
                    {isLoading && (
                    <div className="self-start bg-[#00ffff]/5 backdrop-blur-md py-2 px-4 rounded-xl text-[#00ffff] text-sm animate-pulse border border-[#00ffff]/20">
                        Handshaking with Local Repository...
                    </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Bar */}
      <div className="chat-input-container w-full max-w-[1100px] mx-auto h-[50px] flex items-center justify-between bg-[rgba(0,0,0,0.6)] backdrop-blur-md px-3 md:px-4 rounded-xl border border-[rgba(0,255,255,0.15)] focus-within:border-[#00ffff]/50 transition-all relative z-20 shadow-2xl opacity-100">
        <div className="h-full flex items-center justify-center font-sans mr-2 shrink-0">
            <input 
              ref={fileInputRef}
              name="file" 
              id="file" 
              type="file" 
              accept="image/*"
              className="hidden" 
              onChange={handleFileChange}
            />
            <label htmlFor="file" className="cursor-pointer flex items-center justify-center relative group">
                {selectedImage ? (
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-[#00ffff] border border-white flex items-center justify-center text-[10px] text-black font-bold">✓</div>
                  </div>
                ) : (
                  <svg viewBox="0 0 337 337" fill="none" className="h-[20px] w-[20px] opacity-40 group-hover:opacity-100 transition-opacity text-[#00ffff]">
                      <circle cx="168.5" cy="168.5" r="158.5" fill="none" stroke="currentColor" strokeWidth="20"></circle>
                      <path d="M167.759 79V259" stroke="currentColor" strokeWidth="25" strokeLinecap="round"></path>
                      <path d="M79 167.138H259" stroke="currentColor" strokeWidth="25" strokeLinecap="round"></path>
                  </svg>
                )}
            </label>
        </div>

        <input 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          id="messageInput" 
          type="text" 
          placeholder="ENTER MESSAGE STREAM..." 
          autoComplete="off"
          className="flex-grow h-full bg-transparent outline-none border-none px-3 text-white placeholder-gray-500 text-sm md:text-base min-w-0 font-mono tracking-tight" 
        />

        <button 
          onClick={handleSend}
          id="sendButton" 
          className="uiverse-button flex items-center justify-center ml-2 shrink-0 !px-4 !py-0 h-[36px]"
        >
            <svg viewBox="0 0 664 663" fill="none" className="h-[18px] w-[18px]">
                <path d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.7530 646.157L155.245 331.888" fill="none" stroke="currentColor" strokeWidth="30"></path>
            </svg>
        </button>
      </div>
    </div>
  );
};