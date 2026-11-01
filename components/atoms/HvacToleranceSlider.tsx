'use client';

import React from 'react';

interface HvacToleranceSliderProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  label: string;
  onChange: (val: number) => void;
}

export const HvacToleranceSlider: React.FC<HvacToleranceSliderProps> = ({
  value,
  min,
  max,
  unit,
  label,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2 font-sans">
      <div className="flex justify-between items-center text-xs">
        <span className="engraved-label text-[#8e9aa0]">{label}</span>
        <span className="font-mono text-[12px] text-[#f2f4f4] font-bold bg-[#090d0f] px-2 py-0.5 rounded border border-[#1a2228] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)]" dir="ltr">
          <span className="text-[#f15b22] mr-1">•</span>
          {value} {unit}
        </span>
      </div>
      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-[#0d1215] rounded-sm appearance-none cursor-pointer accent-[#f15b22] border border-[#222c33] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f15b22]"
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
      <div className="flex justify-between text-[11px] text-[#8e9aa0] font-mono font-medium" dir="ltr">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};
