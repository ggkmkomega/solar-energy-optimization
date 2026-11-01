'use client';

import React from 'react';
import { EquipmentMode } from '@/types/energy';

interface EquipmentSelectorProps {
  currentMode: EquipmentMode;
  onSelectMode: (mode: EquipmentMode) => void;
}

export const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const options = [
    { id: 'solar-pv' as EquipmentMode, label: 'طاقة شمسية PV', badge: '425 Wc' },
    { id: 'hvac-pac' as EquipmentMode, label: 'مضخة PAC', badge: 'COP 4.2' },
    { id: 'storage-battery' as EquipmentMode, label: 'بطارية تخزين', badge: '10 kWh' },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="اختيار نوع المعدات"
      className="chassis-well p-1.5 rounded-lg grid grid-cols-3 gap-1.5"
    >
      {options.map((opt) => {
        const isSelected = currentMode === opt.id;
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelectMode(opt.id)}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f15b22] ${
              isSelected
                ? 'key-inset-pressed font-bold text-[#f15b22]'
                : 'key-raised text-[#8e9aa0] hover:text-[#f2f4f4]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full border border-black/40 ${
                  isSelected ? 'active-orange' : 'bg-[#5a676f]'
                }`}
                aria-hidden="true"
              />
              <span className="text-[12px] font-medium tracking-tight truncate">
                {opt.label}
              </span>
            </div>
            <span
              className={`text-[10px] font-mono mt-0.5 ${
                isSelected ? 'text-[#f2f4f4] font-semibold' : 'text-[#8e9aa0]'
              }`}
              dir="ltr"
            >
              {opt.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
};
