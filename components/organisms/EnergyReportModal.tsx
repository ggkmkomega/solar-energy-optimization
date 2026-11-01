'use client';

import React from 'react';

interface EnergyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnergyReportModal: React.FC<EnergyReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
    >
      <div className="instrument-housing w-full max-w-4xl p-5 sm:p-6 flex flex-col gap-4 text-[#f2f4f4] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#2a353c]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 chassis-seam-horizontal">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#f15b22]" aria-hidden="true" />
              <span className="text-[11px] font-mono text-[#8e9aa0]">
                HELIOS-VEKTOR • تقرير هندسي
              </span>
            </div>
            <h2 id="report-modal-title" className="text-base sm:text-lg font-bold text-[#f2f4f4]">
              تقرير كفاءة الطاقة والإنتاج السنوي (RE2020)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="key-raised px-3 py-1.5 text-xs font-bold text-[#f2f4f4] flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#f15b22]"
              title="طباعة أو حفظ التقرير بصيغة PDF"
            >
              <span>🖨️</span>
              <span>طباعة / حفظ PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="إغلاق التقرير الفني"
              className="key-raised w-8 h-8 flex items-center justify-center font-bold text-sm text-[#f2f4f4] focus-visible:outline-2 focus-visible:outline-[#f15b22]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 1. Critical KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <div className="p-3 chassis-raised rounded-md border border-[#2d3840]">
            <div className="engraved-label !text-[10px] text-[#8e9aa0]">القدرة القصوى</div>
            <div className="mt-1 text-xl font-mono font-bold text-[#f2f4f4]" dir="ltr">
              12.75 <span className="text-xs font-medium text-[#8e9aa0]">kWc</span>
            </div>
            <div className="text-[10px] font-mono text-[#38bdf8] font-semibold mt-1">
              +18% عن المعيار
            </div>
          </div>

          <div className="p-3 chassis-raised rounded-md border border-[#2d3840]">
            <div className="engraved-label !text-[10px] text-[#8e9aa0]">الإنتاج الصافي</div>
            <div className="mt-1 text-xl font-mono font-bold text-[#f2f4f4]" dir="ltr">
              16 420 <span className="text-xs font-medium text-[#8e9aa0]">kWh/an</span>
            </div>
            <div className="text-[10px] font-mono text-[#4ade80] font-semibold mt-1">
              استهلاك ذاتي 71%
            </div>
          </div>

          <div className="p-3 chassis-raised rounded-md border border-[#2d3840]">
            <div className="engraved-label !text-[10px] text-[#8e9aa0]">تغطية HVAC</div>
            <div className="mt-1 text-xl font-mono font-bold text-[#f2f4f4]" dir="ltr">
              84.2 <span className="text-xs font-medium text-[#8e9aa0]">%</span>
            </div>
            <div className="text-[10px] font-mono text-[#06b6d4] font-semibold mt-1" dir="ltr">
              COP 4.2
            </div>
          </div>

          <div className="p-3 chassis-raised rounded-md border border-[#2d3840]">
            <div className="engraved-label !text-[10px] text-[#8e9aa0]">فترة الاسترداد (ROI)</div>
            <div className="mt-1 text-xl font-mono font-bold text-[#f2f4f4]" dir="ltr">
              6.8 <span className="text-xs font-medium text-[#8e9aa0]">Ans</span>
            </div>
            <div className="text-[10px] font-mono text-[#f15b22] font-semibold mt-1">
              عائد 20 سنة : 34 200 €
            </div>
          </div>
        </div>

        {/* 2. Monthly Chart & System Losses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Monthly Comparison */}
          <div className="p-3.5 chassis-field-screen rounded-md flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-[#f2f4f4]">
                إنتاج الطاقة الشمسية مقابل استهلاك HVAC
              </span>
              <span className="text-[10px] font-mono text-[#7d8b94]" dir="ltr">kWh / شهر</span>
            </div>

            <div className="h-32 flex items-end gap-1 pt-3 pb-2 border-b border-[#2e3940]">
              {[
                { m: '1', pv: 25, hvac: 80 },
                { m: '2', pv: 40, hvac: 70 },
                { m: '3', pv: 65, hvac: 55 },
                { m: '4', pv: 85, hvac: 35 },
                { m: '5', pv: 110, hvac: 20 },
                { m: '6', pv: 130, hvac: 15 },
                { m: '7', pv: 135, hvac: 15 },
                { m: '8', pv: 120, hvac: 20 },
                { m: '9', pv: 90, hvac: 30 },
                { m: '10', pv: 60, hvac: 50 },
                { m: '11', pv: 35, hvac: 70 },
                { m: '12', pv: 20, hvac: 85 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-0.5 h-full">
                    <div
                      style={{ height: `${(item.pv / 140) * 100}%` }}
                      className="w-2.5 bg-[#f15b22] rounded-t-xs"
                      title={`إنتاج PV: ${item.pv * 15} kWh`}
                    />
                    <div
                      style={{ height: `${(item.hvac / 140) * 100}%` }}
                      className="w-2.5 bg-[#06b6d4] rounded-t-xs"
                      title={`استهلاك HVAC: ${item.hvac * 15} kWh`}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-[#7d8b94]">{item.m}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 mt-2 text-[10px] font-sans">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#f15b22]" />
                <span className="text-[#f2f4f4]">إنتاج شمسي PV</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#06b6d4]" />
                <span className="text-[#f2f4f4]">استهلاك HVAC</span>
              </div>
            </div>
          </div>

          {/* Loss Audit */}
          <div className="p-3.5 chassis-field-screen rounded-md flex flex-col justify-between">
            <span className="text-xs font-semibold text-[#f2f4f4] mb-1.5">
              تدقيق فواقد النظام والكفاءة
            </span>
            <div className="flex flex-col gap-1.5 text-[11px] font-sans">
              <div className="flex justify-between items-center text-[#d8dee1]">
                <span>فواقد التحويل والكابلات :</span>
                <span className="text-[#f2f4f4] font-bold font-mono" dir="ltr">3.2 %</span>
              </div>
              <div className="w-full bg-[#161c20] h-1.5 rounded-full overflow-hidden border border-[#2e373d]">
                <div className="bg-[#f15b22] h-full w-[3.2%]" />
              </div>

              <div className="flex justify-between items-center text-[#d8dee1]">
                <span>فواقد الظلال المجاورة :</span>
                <span className="text-[#f2f4f4] font-bold font-mono" dir="ltr">2.1 %</span>
              </div>
              <div className="w-full bg-[#161c20] h-1.5 rounded-full overflow-hidden border border-[#2e373d]">
                <div className="bg-[#f15b22] h-full w-[2.1%]" />
              </div>

              <div className="flex justify-between items-center text-[#d8dee1]">
                <span>فقدان ضغط شبكة PAC :</span>
                <span className="text-[#f2f4f4] font-bold font-mono" dir="ltr">1.8 %</span>
              </div>
              <div className="w-full bg-[#161c20] h-1.5 rounded-full overflow-hidden border border-[#2e373d]">
                <div className="bg-[#06b6d4] h-full w-[1.8%]" />
              </div>

              <div className="pt-2 border-t border-[#2e3940] flex justify-between font-bold text-xs text-[#f2f4f4]">
                <span>الكفاءة الإجمالية :</span>
                <span className="text-[#f15b22] font-mono" dir="ltr">91.4 %</span>
              </div>
            </div>

            <div className="mt-2 p-2 bg-[#161c20] rounded border border-[#2e373d] text-[10px] text-[#d8dee1]">
              <span className="text-[#f15b22] font-bold ml-1">• توصية IA:</span>
              إجراء صيانة سنوية لمرشحات PAC واستبدال وسيط التبريد R32 يحافظ على أعلى معامل COP.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 chassis-seam-horizontal">
          <span className="text-xs text-[#8e9aa0] font-mono" dir="ltr">
            RE2020 • CSTB • EPSG:4326
          </span>
          <button
            onClick={onClose}
            className="key-raised px-5 py-1.5 text-xs font-semibold text-[#f2f4f4] focus-visible:outline-2 focus-visible:outline-[#f15b22]"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
