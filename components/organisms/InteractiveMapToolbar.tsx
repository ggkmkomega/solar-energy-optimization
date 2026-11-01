'use client';

import React from 'react';
import { EnergyStatusBadge } from '@/components/atoms/EnergyStatusBadge';

interface InteractiveMapToolbarProps {
  projectName?: string;
  isCalculating: boolean;
  onOpenConfig: () => void;
  onTriggerRecalculate: () => void;
  onOpenReport: () => void;
  annualKwh?: string;
}

export const InteractiveMapToolbar: React.FC<InteractiveMapToolbarProps> = ({
  projectName = 'محاكاة الطاقة بالذكاء الاصطناعي',
  isCalculating,
  onOpenConfig,
  onTriggerRecalculate,
  onOpenReport,
  annualKwh = '17 256 kWh/an',
}) => {
  return (
    <header className="chassis-seam-horizontal bg-[#151c20] px-4 py-2.5 flex items-center justify-between gap-3 select-none flex-wrap border-b border-[#242d33]">
      {/* Left / Start: Branding & Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f15b22] shadow-[0_0_8px_rgba(241,91,34,0.7)]" aria-hidden="true" />
          <span className="font-mono text-sm font-bold tracking-tight text-[#f2f4f4]">
            HELIOS-VEKTOR
          </span>
        </div>

        <span className="text-[#3a4750] hidden sm:inline">|</span>

        <h1 className="text-sm font-bold text-[#f2f4f4] hidden md:inline">
          {projectName}
        </h1>

        <EnergyStatusBadge status={isCalculating ? 'computing' : 'optimal'} />

        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0e1316] text-[11px] font-mono text-[#38bdf8] font-semibold border border-[#222c33]" dir="ltr">
          <span>{annualKwh}</span>
        </div>
      </div>

      {/* Right / End: Actions (Dial, Settings, Report) */}
      <div className="flex items-center gap-2.5">
        {/* Recalculate Dial */}
        <button
          onClick={onTriggerRecalculate}
          disabled={isCalculating}
          title="إعادة الحساب بالذكاء الاصطناعي"
          aria-label="إعادة الحساب بالذكاء الاصطناعي"
          className="dial-action-button !w-9 !h-9"
        >
          <span
            className={`indicator-lamp !w-2 !h-2 ${
              isCalculating ? 'active-orange animate-ping' : 'active-orange'
            }`}
            aria-hidden="true"
          />
        </button>

        {/* Settings Menu Button */}
        <button
          onClick={onOpenConfig}
          className="key-raised px-3 py-1.5 text-xs font-semibold text-[#f2f4f4] flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#f15b22]"
        >
          <span className="text-xs">⚙️</span>
          <span>الإعدادات</span>
        </button>

        {/* Report Button */}
        <button
          onClick={onOpenReport}
          className="key-raised px-3 py-1.5 text-xs font-bold text-[#f2f4f4] flex items-center gap-1.5 border-[#38464f] focus-visible:outline-2 focus-visible:outline-[#f15b22]"
        >
          <span className="w-2 h-2 rounded-full bg-[#f15b22]" aria-hidden="true" />
          <span>تقرير BIM / PDF</span>
        </button>
      </div>
    </header>
  );
};
