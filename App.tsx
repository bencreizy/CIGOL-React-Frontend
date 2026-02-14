import React, { useState } from 'react';
import { ComplexToggle } from './components/ComplexToggle';
import { ChatInterface } from './components/ChatInterface';
import { WorkspaceInterface } from './components/WorkspaceInterface';
import { Waves } from './components/Waves';

export default function App() {
  const [isWorkspaceMode, setIsWorkspaceMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Science");

  // Categories for the header
  const categories = ["Science", "Health", "Industry", "Develop"];

  const handleCategoryChange = (cat: string) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
  };

  return (
    <div className="relative h-screen bg-white text-black font-sans overflow-hidden">
      {/* 1. LAYER: Background Waves (z-1) */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <Waves 
          className="w-full h-full"
          strokeColor="rgba(0, 0, 0, 0.3)" 
          backgroundColor="#FFFFFF"
        />
      </div>

      {/* 2. LAYER: Middle Logo Overlay (z-2) - In front of Waves, Behind HUD */}
      <div className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[72%] h-[72%] opacity-100 transition-all duration-700 translate-y-4">
            <img 
              src="https://raw.githubusercontent.com/bencreizy/Key/main/cigol.png" 
              alt="CIGOL Background Decor" 
              className="w-full h-full object-contain"
            />
        </div>
        {/* Tech Grid Backdrop */}
        <div className="backdrop opacity-20"></div>
      </div>

      {/* 3. LAYER: UI HUD (z-3) - Absolute stack */}
      <div className="absolute inset-0 z-[3] flex flex-col h-full pointer-events-none">
        {/* Header - Solid black background */}
        <header className="flex justify-between items-center px-4 md:px-8 h-[80px] md:h-[100px] border-b border-white/10 bg-black shrink-0 transition-all duration-300 gap-4 pointer-events-auto shadow-2xl">
          
          {/* Top Left: Category Buttons */}
          <div className="flex items-center gap-4 md:gap-12 overflow-x-auto no-scrollbar mask-fade flex-1 md:flex-none">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => handleCategoryChange(cat)}
                className={`button shrink-0 scale-90 md:scale-100 ${activeCategory === cat ? 'active' : ''}`}
              >
                <div className="a l"></div>
                <div className="a r"></div>
                <div className="a t"></div>
                <div className="a b"></div>
                <div className="text">{cat}</div>
              </button>
            ))}
          </div>

          {/* Top Center: App Logo */}
          <div className="flex-shrink-0 hidden sm:block">
            <img 
              src="https://raw.githubusercontent.com/bencreizy/Key/main/full.logo.png" 
              alt="CIGOL Logo" 
              className="h-16 md:h-28 w-auto object-contain transition-transform hover:scale-110 duration-300"
            />
          </div>

          {/* Top Right: Mode Toggle */}
          <div className="flex justify-end min-w-[80px] md:min-w-[100px] shrink-0">
            <div className="scale-75 md:scale-100 origin-right">
                <ComplexToggle 
                isChecked={isWorkspaceMode} 
                onToggle={() => setIsWorkspaceMode(prev => !prev)} 
                />
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-hidden relative w-full h-full pointer-events-auto">
          {/* Page One: Chat / HUD (Glass Transparency) */}
          <div className={`absolute inset-0 flex flex-col p-2 md:p-5 transition-all duration-500 ease-in-out ${
            isWorkspaceMode ? 'translate-x-[-100%] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'
          }`}>
            <ChatInterface key={`chat-${activeCategory}`} category={activeCategory} />
          </div>

          {/* Page Two: Workspace (Glass Transparency) */}
          <div className={`absolute inset-0 flex flex-col p-2 md:p-5 transition-all duration-500 ease-in-out ${
            isWorkspaceMode ? 'translate-x-0 opacity-100' : 'translate-x-[100%] opacity-0 pointer-events-none'
          }`}>
            <WorkspaceInterface key={`workspace-${activeCategory}`} category={activeCategory} />
          </div>
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
