'use client';

import React from 'react';
import { MetricKpiCard } from '@/components/molecules/MetricKpiCard';
import { HvacToleranceSlider } from '@/components/atoms/HvacToleranceSlider';

interface EnergyFlowAnalysisSidebarProps {
  metrics: {
    installedKw: string;
    annualProductionKwh: string;
    hvacCoveragePct: string;
    roiYears: string;
  };
  noiseLimitDb: number;
  onNoiseLimitChange: (val: number) => void;
  onDownloadReport: () => void;
}

export const EnergyFlowAnalysisSidebar: React.FC<EnergyFlowAnalysisSidebarProps> = ({
  metrics,
  noiseLimitDb,
  onNoiseLimitChange,
  onDownloadReport,
}) => {
  return (
    <aside
      aria-label="تحليل تدفق الطاقة"
      className="w-80 h-full chassis-seam-vertical bg-[#d0d6d8] flex flex-col justify-between overflow-y-auto p-4 gap-4"
    >
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="engraved-label !text-[11px] text-[#181e22] mb-0.5">
            ملخص التحسين الطاقي
          </h2>
          <p className="text-[12px] text-[#5a676f] leading-snug">
            حساب هندسي للمصفوفات وفق معيار RE2020.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <MetricKpiCard
            title="قدرة PV"
            value={metrics.installedKw}
            unit="kWc"
            category="solar"
            delta={{ value: '+14%', positive: true }}
          />
          <MetricKpiCard
            title="الإنتاج"
            value={metrics.annualProductionKwh}
            unit="kWh"
            category="solar"
            subtext="استهلاك 74%"
          />
          <MetricKpiCard
            title="تغطية HVAC"
            value={metrics.hvacCoveragePct}
            unit="%"
            category="hvac"
            delta={{ value: 'COP 4.2', positive: true }}
          />
          <MetricKpiCard
            title="الاسترداد"
            value={metrics.roiYears}
            unit="Ans"
            category="financial"
            subtext="TIR : 11.2%"
          />
        </div>

        <div className="p-3 chassis-raised rounded-md border border-[#b7c1c6] flex flex-col gap-3">
          <HvacToleranceSlider
            label="حد ضجيج مضخة PAC"
            min={25}
            max={45}
            unit="dB(A)"
            value={noiseLimitDb}
            onChange={onNoiseLimitChange}
          />
        </div>
      </div>

      <div className="pt-3 border-t border-[#b2bcc0] flex flex-col gap-2">
        <button
          onClick={onDownloadReport}
          className="key-raised w-full py-2.5 text-[#181e22] text-xs font-bold border-[#9da7ad] focus-visible:outline-2 focus-visible:outline-[#f15b22]"
        >
          تحميل المخطط الأحادي الخط
        </button>
      </div>
    </aside>
  );
};
