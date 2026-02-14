import React, { useState } from 'react';

interface WorkspaceInterfaceProps {
  category?: string;
}

export const WorkspaceInterface: React.FC<WorkspaceInterfaceProps> = ({ category = "Science" }) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleExport = () => {
    const content = `--- EXPORT LOG [${category} Mode] ---\nSelected: ${Array.from(selectedItems).join(', ')}\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cigol_${category.toLowerCase()}_workspace.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleItemSelection = (itemName: string) => {
    const next = new Set(selectedItems);
    if (next.has(itemName)) next.delete(itemName);
    else next.add(itemName);
    setSelectedItems(next);
  };

  const WorkspaceItem = ({ name, icon }: { name: string; icon: string }) => (
    <div className={`flex items-center justify-between py-1.5 px-3 hover:bg-white/5 rounded transition-colors mb-1 group/item`}>
      <div className="flex items-center gap-3">
        <input 
          type="checkbox" 
          checked={selectedItems.has(name)} 
          onChange={() => toggleItemSelection(name)}
          className="w-4 h-4 accent-[#00ffff] bg-black border-[#00ffff]/40 rounded cursor-pointer"
        />
        <span className="text-sm font-mono text-white opacity-100">{icon} {name}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto overflow-hidden">
      <style>{`
        .card {
          width: 100%;
          flex: 1;
          display: flex;
          gap: 12px;
          padding: 10px;
          min-height: 0;
        }

        .panel {
          height: 100%;
          flex: 1;
          overflow: hidden;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          /* HUD default background opacity */
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(1px);
          -webkit-backdrop-filter: blur(1px);
          border: 1px solid rgba(0, 255, 255, 0.05);
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .panel:hover, .panel:active, .panel:focus-within {
          flex: 5;
          transform: translateY(-4px);
          /* Decreased highlight opacity by 10% (from 0.85 to 0.75) */
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-color: #00ffff;
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.1);
          z-index: 10;
        }

        .label {
          white-space: nowrap;
          padding: .5em;
          text-transform: uppercase;
          color: rgba(0, 255, 255, 0.5);
          font-weight: 700;
          letter-spacing: .2em;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          transition: all 0.3s;
          font-size: 0.75rem;
          opacity: 1.0;
        }

        .panel:hover .label, .panel:active .label, .panel:focus-within .label {
          opacity: 0;
        }

        .content {
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 24px;
          box-sizing: border-box;
          overflow-y: auto;
        }

        .panel:hover .content, .panel:active .content, .panel:focus-within .content {
          opacity: 1;
          visibility: visible;
          transition-delay: 0.15s;
        }
        
        @media (max-width: 768px) {
          .card {
            flex-direction: column;
          }
          .panel:hover {
            transform: translateY(0) scale(1.02);
          }
          .label {
            transform: translate(-50%, -50%);
          }
        }
      `}</style>

      <div className="card">
        {/* CONSOLE PANEL */}
        <div className="panel" tabIndex={0}>
          <span className="label">CONSOLE</span>
          <div className="content">
            <h3 className="text-[#00ffff] font-bold mb-4 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               TERMINAL 1.0 - {category.toUpperCase()} REPO
            </h3>
            <div className="font-mono text-sm space-y-2 text-white">
              <div>[SYSTEM] ${category.toLowerCase()}_bridge initialized.</div>
              <div>[USER] Authenticated: Developer_HUD</div>
              <div>[INFO] Context: ${category} Mode Active</div>
              <div>[STATUS] Monitoring repository threads...</div>
              <div className="text-cyan-400 mt-4 animate-pulse">_</div>
            </div>
          </div>
        </div>
        
        {/* FILES PANEL */}
        <div className="panel" tabIndex={0}>
          <span className="label">FILES</span>
          <div className="content">
            <h3 className="text-[#00ffff] font-bold mb-4 border-b border-[#00ffff]/20 pb-2">DIRECTORY - {category.toUpperCase()}</h3>
            <div className="space-y-1">
              <WorkspaceItem name={`${category.toLowerCase()}_main.tsx`} icon="⚛️" />
              <WorkspaceItem name="shared_utils.py" icon="🐍" />
              <WorkspaceItem name="manifest.json" icon="📄" />
              <div className="mt-4 pl-4 border-l border-[#00ffff]/20">
                <p className="text-[10px] uppercase tracking-widest text-[#00ffff]/40 mb-2">local_repo</p>
                <WorkspaceItem name="config.py" icon="⚡" />
                <WorkspaceItem name="deps.lock" icon="📦" />
              </div>
            </div>
          </div>
        </div>

        {/* NOTES PANEL */}
        <div className="panel" tabIndex={0}>
          <span className="label">NOTES</span>
          <div className="content">
             <h3 className="text-[#00ffff] font-bold mb-4">LOGS</h3>
             <div className="font-mono text-sm text-white space-y-2">
                <p className="text-[#00ffff]/60">// ${category.toUpperCase()}_SESSION</p>
                <p>- Mode: {category}</p>
                <p>- HUD Synchronized with category repository.</p>
                <p>- Reset logic validated.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Export Action */}
      <div className="h-[80px] flex items-center justify-center shrink-0 opacity-90 hover:opacity-100 transition-opacity">
        <button className="button scale-90 md:scale-100 active" onClick={handleExport} style={{ width: '200px' }}>
            <div className="a l"></div>
            <div className="a r"></div>
            <div className="a t"></div>
            <div className="a b"></div>
            <div className="text">EXPORT {category.toUpperCase()} DATA</div>
        </button>
      </div>
    </div>
  );
};