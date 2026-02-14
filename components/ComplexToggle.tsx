import React from 'react';

interface ComplexToggleProps {
  isChecked: boolean;
  onToggle: () => void;
}

export const ComplexToggle: React.FC<ComplexToggleProps> = ({ isChecked, onToggle }) => {
  return (
    <div 
      className="flex items-center gap-6 select-none relative z-50 cursor-pointer"
      onClick={onToggle}
    >
      <style>{`
        /* From Uiverse.io by adamgiebl */ 
        .toggle-container {
          --knob-size: 1.75em;
          display: flex;
          justify-content: center;
          position: relative;
        }

        .toggle-input {
          position: absolute;
          z-index: 2;
          bottom: 132.5%;
          border-radius: 50%;
          transform: rotate(-25deg);
          transform-origin: 50% 4.75em;
          width: var(--knob-size);
          height: var(--knob-size);
          opacity: 0;
          /* fix em sizing */
          font: inherit;
          transition: transform .24s cubic-bezier(.65, 1.35, .5, 1);
          cursor: pointer;
        }

        .toggle-input:checked {
          transform: rotate(25deg);
        }

        .toggle-handle-wrapper {
          position: absolute;
          z-index: 1;
          bottom: -135%;
          -webkit-mask-image: linear-gradient(to bottom, #000 62.125%, transparent 50%);
          mask-image: linear-gradient(to bottom, #000 62.125%, transparent 50%);
          width: 200%;
          overflow: hidden;
        }

        .toggle-handle {
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: rotate(-25deg);
          transform-origin: bottom center;
          transition: transform .24s cubic-bezier(.65, 1.35, .5, 1);
        }

        .toggle-input:checked + .toggle-handle-wrapper > .toggle-handle {
          transform: rotate(25deg);
        }

        .toggle-handle-knob {
          position: relative;
          z-index: 1;
          border-radius: 50%;
          width: var(--knob-size);
          height: var(--knob-size);
          background-image: radial-gradient(farthest-corner at 70% 30%, #ffffff 4%, #61bdda 12% 24%, #4791b2 50% 65%, #61bdda 75%);
          transition: transform .24s cubic-bezier(.65, 1.35, .5, 1);
        }

        .toggle-input:checked + .toggle-handle-wrapper .toggle-handle-knob {
          transform: rotate(-90deg);
        }

        /* toggle handle knob hover inner shadow */
        .toggle-handle-knob::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          border-radius: inherit;
          width: 100%;
          height: 100%;
          box-shadow: inset 0 0 8px 2px rgb(255 255 255 / .4);
          opacity: 0;
          transition: opacity .2s;
        }

        @media (hover: hover) {
          .toggle-input:hover + .toggle-handle-wrapper .toggle-handle-knob::after,
          .toggle-input:focus-visible + .toggle-handle-wrapper .toggle-handle-knob::after {
            opacity: 1;
          }
        }

        .toggle-handle-bar-wrapper {
          position: relative;
          width: .5em;
          height: 3em;
        }

        .toggle-handle-bar {
          position: absolute;
          top: calc(var(--knob-size) / 2 * -1);
          left: 0;
          width: 100%;
          height: calc(100% + var(--knob-size) / 2);
          background-image: linear-gradient(to right, #1f1f1f, #161616, #1f1f1f 45% 55%, #161616, #1f1f1f);
          background-position-x: .06125em;
          transition: background-position-x .24s cubic-bezier(.65, 1.35, .5, 1);
          box-shadow: inset 0 1em .25em rgb(0 0 0 / .4);
        }

        .toggle-input:checked + .toggle-handle-wrapper .toggle-handle-bar {
          background-position-x: -.06125em;
        }

        .toggle-base {
          position: relative;
          border-radius: 3.125em;
          padding: .25em;
          width: 3.5em;
          height: 1.125em;
          background-color: #222222;
          background-image: linear-gradient(to bottom, #444444, #222222);
          box-shadow: 0 -.25em .5em #fff, 0 .25em .5em #d7d7d7;
        }

        .toggle-base-inside {
          position: relative;
          border-radius: inherit;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(to bottom, #1f1f1f, #0f0f0f);
          box-shadow: inset 0 .0625em rgb(255 255 255 / .2), inset 0 -.03125em rgb(255 255 255 / 1), inset 0 -.0625em .25em rgb(0 0 0 / .1);
        }

        /* toggle base inside active */
        .toggle-base-inside::after {
          content: '';
          position: absolute;
          border-radius: inherit;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(to bottom, #00cfb6, #00a5bf);
          box-shadow: inherit;
          opacity: 0;
          transition: opacity .24s cubic-bezier(.65, 1.35, .5, 1);
        }

        .toggle-input:checked ~ .toggle-base .toggle-base-inside::after {
          opacity: 1;
        }
      `}</style>

      {/* Page One Indicator (Single Light) - Left */}
      {/* Glows when isChecked is false (Chat Mode) */}
      <div 
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          !isChecked 
            ? 'bg-[#00ffff] shadow-[0_0_10px_2px_rgba(0,255,255,0.8)] scale-125' 
            : 'bg-[#004444] opacity-40'
        }`}
      />

      {/* The Mechanical Toggle Switch */}
      <div className="toggle-container scale-75 origin-center">
        <input 
          className="toggle-input" 
          type="checkbox" 
          checked={isChecked}
          readOnly
        />
        <div className="toggle-handle-wrapper">
          <div className="toggle-handle">
            <div className="toggle-handle-knob"></div>
            <div className="toggle-handle-bar-wrapper">
              <div className="toggle-handle-bar"></div>
            </div>
          </div>
        </div>
        <div className="toggle-base">
          <div className="toggle-base-inside"></div>
        </div>
      </div>

      {/* Page Two Indicator (Double Light) - Right */}
      {/* Glows when isChecked is true (Workspace Mode) */}
      <div className="flex gap-1.5">
        <div 
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isChecked 
              ? 'bg-[#00ffff] shadow-[0_0_10px_2px_rgba(0,255,255,0.8)] scale-125' 
              : 'bg-[#004444] opacity-40'
          }`}
        />
        <div 
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isChecked 
              ? 'bg-[#00ffff] shadow-[0_0_10px_2px_rgba(0,255,255,0.8)] scale-125' 
              : 'bg-[#004444] opacity-40'
          }`}
        />
      </div>
    </div>
  );
};