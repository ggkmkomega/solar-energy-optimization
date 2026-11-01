'use client';

import React from 'react';

interface CanvasControlToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetBearing: () => void;
  onToggle3D: () => void;
  is3D: boolean;
}

export const CanvasControlToolbar: React.FC<CanvasControlToolbarProps> = ({
  onZoomIn,
  onZoomOut,
  onResetBearing,
  onToggle3D,
  is3D,
}) => {
  return (
    <div
      role="toolbar"
      aria-label="أدوات التحكم في الخريطة"
      className="chassis-well p-1 rounded-md border border-[#9ca7ac] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3),0_4px_10px_rgba(0,0,0,0.25)] flex flex-col gap-1.5"
    >
      <div className="flex flex-col gap-1">
        <button
          onClick={onZoomIn}
          title="تكبير (+)"
          aria-label="تكبير"
          className="key-raised w-8 h-8 flex items-center justify-center text-[#181e22] text-base font-bold font-mono focus-visible:outline-2 focus-visible:outline-[#f15b22]"
        >
          +
        </button>
        <button
          onClick={onZoomOut}
          title="تصغير (−)"
          aria-label="تصغير"
          className="key-raised w-8 h-8 flex items-center justify-center text-[#181e22] text-base font-bold font-mono focus-visible:outline-2 focus-visible:outline-[#f15b22]"
        >
          −
        </button>
      </div>

      <div className="h-[1px] bg-[#9ba5aa] mx-0.5" />

      <div className="flex flex-col gap-1">
        <button
          onClick={onResetBearing}
          title="إعادة التوجيه إلى الشمال"
          aria-label="إعادة التوجيه إلى الشمال"
          className="key-raised w-8 h-8 flex items-center justify-center text-[#181e22] font-mono text-xs font-bold focus-visible:outline-2 focus-visible:outline-[#f15b22]"
        >
          N
        </button>
        <button
          onClick={onToggle3D}
          title="تبديل وضع 2D/3D"
          aria-label="تبديل وضع 2D/3D"
          className={`w-8 h-8 flex items-center justify-center rounded font-mono text-[10px] font-bold focus-visible:outline-2 focus-visible:outline-[#f15b22] ${
            is3D
              ? 'key-inset-pressed text-[#f15b22]'
              : 'key-raised text-[#414b52] hover:text-[#181e22]'
          }`}
        >
          {is3D ? '3D' : '2D'}
        </button>
      </div>
    </div>
  );
};
