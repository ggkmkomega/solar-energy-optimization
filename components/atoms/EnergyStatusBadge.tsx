import React from 'react';
import { EnergyStatusType } from '@/types/energy';

interface EnergyStatusBadgeProps {
  status: EnergyStatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<
  EnergyStatusType,
  { lampClass: string; textColor: string; defaultLabel: string }
> = {
  optimal: {
    lampClass: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.85)]',
    textColor: 'text-[#f2f4f4]',
    defaultLabel: 'تشغيل مثالي',
  },
  moderate: {
    lampClass: 'bg-teal-500 shadow-[0_0_6px_rgba(20,184,166,0.8)]',
    textColor: 'text-[#f2f4f4]',
    defaultLabel: 'أداء معتدل',
  },
  degraded: {
    lampClass: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]',
    textColor: 'text-[#f2f4f4]',
    defaultLabel: 'أداء منخفض',
  },
  warning: {
    lampClass: 'bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.85)]',
    textColor: 'text-[#f2f4f4]',
    defaultLabel: 'تنبيه فقد',
  },
  computing: {
    lampClass: 'active-orange animate-pulse',
    textColor: 'text-[#f15b22]',
    defaultLabel: 'جاري الحساب...',
  },
};

export const EnergyStatusBadge: React.FC<EnergyStatusBadgeProps> = ({
  status,
  label,
  className = '',
}) => {
  const config = statusConfig[status];

  return (
    <span
      role="status"
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#b6bec2] border border-[#9ea8ad] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),inset_-1px_-1px_1px_rgba(255,255,255,0.6)] font-mono text-[11px] font-semibold ${className}`}
    >
      <span
        className={`w-2 h-2 rounded-full border border-black/40 flex-shrink-0 ${config.lampClass}`}
        aria-hidden="true"
      />
      <span className={`text-[11px] font-sans font-bold ${config.textColor}`}>
        {label || config.defaultLabel}
      </span>
    </span>
  );
};
