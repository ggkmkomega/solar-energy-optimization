import React from 'react';

interface MetricKpiCardProps {
  title: string;
  value: string;
  unit?: string;
  delta?: { value: string; positive: boolean };
  subtext?: string;
  category: 'solar' | 'hvac' | 'financial';
}

export const MetricKpiCard: React.FC<MetricKpiCardProps> = ({
  title,
  value,
  unit,
  delta,
  subtext,
}) => {
  return (
    <div className="chassis-raised rounded-md p-3 flex flex-col justify-between border border-[#2d3840] shadow-[inset_1px_1px_0_rgba(255,255,255,0.08),inset_-1px_-1px_0_rgba(0,0,0,0.35),0_2px_4px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between">
        <span className="engraved-label !text-[11px] text-[#8e9aa0] truncate">
          {title}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#f15b22] opacity-75" aria-hidden="true" />
      </div>

      <div className="mt-2 flex items-baseline gap-1" dir="ltr">
        <span className="text-[20px] font-mono font-bold text-[#f2f4f4] tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-[11px] font-mono font-medium text-[#8e9aa0]">
            {unit}
          </span>
        )}
      </div>

      {(delta || subtext) && (
        <div className="mt-2 pt-1.5 border-t border-[#242d33] flex items-center justify-between text-[11px] font-mono">
          {delta && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                delta.positive
                  ? 'bg-[#14231e] text-[#4ade80] border-[#166534]'
                  : 'bg-[#2b1714] text-[#f87171] border-[#991b1b]'
              }`}
              dir="ltr"
            >
              {delta.positive ? '▲' : '▼'} {delta.value}
            </span>
          )}
          {subtext && (
            <span className="text-[#5a676f] text-[10px] font-sans truncate">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
