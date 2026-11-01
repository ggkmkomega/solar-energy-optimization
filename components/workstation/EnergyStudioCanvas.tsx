'use client';

import React, { useState } from 'react';
import { InteractiveMapToolbar } from '@/components/organisms/InteractiveMapToolbar';
import { ConfigImportModal } from '@/components/organisms/ConfigImportModal';
import { EnergyReportModal } from '@/components/organisms/EnergyReportModal';
import { EquipmentMode, MapLayersState } from '@/types/energy';

export const EnergyStudioCanvas: React.FC = () => {
  // Navigation, Pan & Modals
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [isMapKeyExpanded, setIsMapKeyExpanded] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showKpiDeck, setShowKpiDeck] = useState(false);

  // Map Layer Toggles
  const [layers, setLayers] = useState<MapLayersState>({
    cadastre: true,
    walls: true,
    environmentalVectors: true,
    thermalEfficiencyHeatmap: true,
    hvacUnits: true,
    solarPv: true,
    windTurbine: true,
    obstacles: true,
  });

  const [equipmentMode, setEquipmentMode] = useState<EquipmentMode>('solar-pv');
  const [noiseLimit, setNoiseLimit] = useState(35);

  // Dynamic Metrics State
  const [metrics, setMetrics] = useState({
    annualKwh: '17 256',
    refrigerantMeters: '29',
    comfortScore: '94.2',
    roiYears: '5.9',
  });

  // Dynamic Hover Tooltip on House Plan
  const [hoveredElement, setHoveredElement] = useState<{
    name: string;
    category: string;
    details: string;
    x: number;
    y: number;
  } | null>(null);

  // Selected Item for Inspection
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    category: string;
    icon: string;
    kpis: Array<{ label: string; value: string }>;
    diagnostic: string;
  }>({
    title: 'محطة هجينة: طاقة شمسية + رياح',
    category: 'طاقة متجددة',
    icon: '☀️',
    kpis: [
      { label: 'الإنتاج الإجمالي', value: '17 256 kWh/an' },
      { label: 'ألواح السقف', value: '20 PV (أحادي البلورة)' },
      { label: 'ألواح الأرضية', value: '6 PV (جنوب)' },
      { label: 'توربين الرياح', value: '1.5 kWc' },
    ],
    diagnostic: 'تهيئة معتمدة دون أي حجب أو ظلال حرجة على السقف.',
  });

  const toggleLayer = (key: keyof MapLayersState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const triggerIaRecalculation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      const variation = (Math.random() * 200 - 100).toFixed(0);
      setMetrics((prev) => ({
        ...prev,
        annualKwh: (17256 + parseInt(variation, 10)).toLocaleString('fr-FR'),
      }));
    }, 850);
  };

  // Canvas Mouse & Wheel Navigation Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'svg' ||
      target.id === 'sketch-bg' ||
      target.tagName === 'MAIN' ||
      target.id === 'workspace-container'
    ) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      setMousePos({
        x: Math.min(Math.max(rawX, 150), Math.max(rect.width - 150, 200)),
        y: Math.max(rawY, 60),
      });
    }
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const zoomDelta = e.deltaY < 0 ? 0.12 : -0.12;
      setZoomLevel((z) => Math.min(Math.max(Number((z + zoomDelta).toFixed(2)), 0.5), 2.5));
    } else {
      setPan((p) => ({
        x: Math.round(p.x - e.deltaX * 0.85),
        y: Math.round(p.y - e.deltaY * 0.85),
      }));
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col p-1 sm:p-2 box-border bg-[#0a0d0f] overflow-hidden">
      {/* CONTINUOUS INSTRUMENT CHASSIS HOUSING - UNIFIED DARK MODE */}
      <div className="instrument-housing flex-1 flex flex-col w-full h-full overflow-hidden border border-[#2a353c]">
        {/* 1. COMPACT STREAMLINED TOPBAR */}
        <InteractiveMapToolbar
          projectName="محاكاة الطاقة بالذكاء الاصطناعي"
          isCalculating={isCalculating}
          onOpenConfig={() => setIsSettingsOpen(true)}
          onTriggerRecalculate={triggerIaRecalculation}
          onOpenReport={() => setIsReportOpen(true)}
          annualKwh={`${metrics.annualKwh} kWh/an`}
        />

        {/* 2. MAIN WORKSPACE WITH SCROLL / PAN NAVIGATION */}
        <div
          id="workspace-container"
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex-1 relative overflow-hidden bg-[#090d0f]"
        >
          {/* LEFT PANEL: DRAWING KEY & UNITS (COLLAPSIBLE ON CLICK) */}
          <aside className="absolute left-3 top-3 z-30 w-52 sm:w-60 chassis-field-screen p-2.5 rounded-lg shadow-2xl border border-[#242d33] flex flex-col gap-2 select-none max-h-[calc(100vh-100px)] overflow-y-auto">
            <button
              onClick={() => setIsMapKeyExpanded(!isMapKeyExpanded)}
              className="w-full flex items-center justify-between text-xs font-bold text-[#f2f4f4] hover:text-[#f15b22] transition-colors focus-visible:outline-2 focus-visible:outline-[#f15b22]"
              aria-expanded={isMapKeyExpanded}
              title="انقر لتوسيع أو طي مفتاح الرسم والوحدات"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f15b22]" />
                مفتاح الرسم والوحدات
              </span>
              <span className="text-[10px] font-mono text-[#8e9aa0] bg-[#141b20] px-1.5 py-0.5 rounded border border-[#242d33] flex items-center gap-1" dir="ltr">
                {isMapKeyExpanded ? '▲ طي' : '▼ توسيع'}
              </span>
            </button>

            {isMapKeyExpanded && (
              <div className="flex flex-col gap-2 pt-1 border-t border-[#242d33] animate-in fade-in-50 duration-150">
                {/* Selected Element Quick Banner */}
                {selectedItem && (
                  <div className="p-2 rounded bg-[#0d1215] border border-[#f15b22]/40 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#f8fafc] flex items-center gap-1 truncate">
                        <span>{selectedItem.icon}</span>
                        <span className="truncate">{selectedItem.title}</span>
                      </span>
                      <span className="text-[9px] font-mono text-[#f15b22] bg-[#1a2228] px-1 py-0.5 rounded shrink-0">
                        {selectedItem.category}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-[#94a3b8] pt-1 border-t border-[#1a2228]">
                      {selectedItem.kpis.slice(0, 2).map((k, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-[9px] text-[#64748b]">{k.label}</span>
                          <span className="text-[#f15b22] font-semibold">{k.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1.5 text-[11px] font-sans text-[#d8dee1]">
                  {/* PV Solar Key */}
                  <div className="p-1.5 rounded bg-[#0b0f12] border border-[#1a2228] flex flex-col gap-0.5">
                    <span className="font-bold text-[#f2f4f4] flex items-center gap-1">
                      ☀️ مصفوفات شمسية PV
                    </span>
                    <span className="text-[10px] font-mono text-[#7dd3fc]" dir="ltr">
                      السقف: 20x 425 Wc (8.5 kWc)
                    </span>
                    <span className="text-[10px] font-mono text-[#7dd3fc]" dir="ltr">
                      الأرض: 6x 425 Wc (2.55 kWc)
                    </span>
                  </div>

                  {/* HVAC PAC Key */}
                  <div className="p-1.5 rounded bg-[#0b0f12] border border-[#1a2228] flex flex-col gap-0.5">
                    <span className="font-bold text-[#f2f4f4] flex items-center gap-1">
                      ❄️ شبكة وتكييف PAC
                    </span>
                    <span className="text-[10px] font-mono text-[#67e8f9]" dir="ltr">
                      مكثف 9.0 kW • مسار 29 م R32
                    </span>
                    <span className="text-[10px] text-[#94a3b8]">
                      كاسيتات سقفية: AC1, AC2, AC3
                    </span>
                  </div>

                  {/* Wind Direction Key */}
                  <div className="p-1.5 rounded bg-[#0b0f12] border border-[#1a2228] flex flex-col gap-0.5">
                    <span className="font-bold text-[#f2f4f4] flex items-center gap-1">
                      💨 الرياح السائدة
                    </span>
                    <span className="text-[10px] font-mono text-[#38bdf8]" dir="ltr">
                      4 أسهم زاوية (301° WNW • 8.2 m/s)
                    </span>
                  </div>

                  {/* Sun Light Cone Key */}
                  <div className="p-1.5 rounded bg-[#0b0f12] border border-[#1a2228] flex flex-col gap-0.5">
                    <span className="font-bold text-[#f2f4f4] flex items-center gap-1">
                      ☀️ الشمس ومخروط الإشعاع
                    </span>
                    <span className="text-[10px] font-mono text-[#fde047]" dir="ltr">
                      شمس علوية متلاشية (181° S • 49°)
                    </span>
                    <span className="text-[10px] text-[#94a3b8]">
                      متوسط سنوي: 1450 kWh/m²
                    </span>
                  </div>

                  {/* Thermal Magma Key */}
                  <div className="p-1.5 rounded bg-[#0b0f12] border border-[#1a2228] flex flex-col gap-1">
                    <span className="font-bold text-[#f2f4f4] flex items-center gap-1">
                      🔥 تدرج Magma الحراري
                    </span>
                    <div className="w-full h-2 rounded-sm bg-gradient-to-r from-[#1e1b4b] via-[#dc2626] to-[#fef08a] border border-[#242d33]" />
                    <div className="flex justify-between text-[9px] font-mono text-[#7d8b94]" dir="ltr">
                      <span>0.0 (عزل)</span>
                      <span>0.6 (كفاءة)</span>
                    </div>
                  </div>

                  {/* Wind Turbine Key */}
                  <div className="p-1.5 rounded bg-[#0b0f12] border border-[#1a2228] flex flex-col gap-0.5">
                    <span className="font-bold text-[#f2f4f4] flex items-center gap-1">
                      🌀 توربين رياح مصغر
                    </span>
                    <span className="text-[10px] font-mono text-[#34d399]" dir="ltr">
                      1.5 kWc • ارتفاع 6 م
                    </span>
                  </div>

                  {/* Scale Key */}
                  <div className="p-1.5 rounded bg-[#0b0f12] border border-[#1a2228] flex flex-col gap-0.5">
                    <span className="font-bold text-[#f2f4f4] flex items-center gap-1">
                      📐 مقياس الرسم SIG
                    </span>
                    <span className="text-[10px] font-mono text-[#94a3b8]" dir="ltr">
                      شبكة 0.25 م (1 خلية = 5px)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* RIGHT PANEL: LAYER TOGGLES (EXACT USER SPEC - UNIFIED DARK MODE) */}
          <aside className="absolute right-3 top-3 z-30 w-28 sm:w-32 chassis-field-screen p-2 rounded-lg shadow-2xl border border-[#242d33] flex flex-col gap-1.5 select-none max-h-[calc(100vh-100px)] overflow-y-auto">
            <span className="text-xs font-bold text-[#f2f4f4] px-1 pb-1 border-b border-[#242d33] text-center block">
              الطبقات:
            </span>

            {[
              { id: 'solarPv', label: 'شمس PV', icon: '☀️' },
              { id: 'hvacUnits', label: 'تكييف PAC', icon: '❄️' },
              { id: 'thermalEfficiencyHeatmap', label: 'حرارة', icon: '🔥' },
              { id: 'walls', label: 'المبنى', icon: '🏢' },
              { id: 'obstacles', label: 'الأشجار', icon: '🌳' },
              { id: 'windTurbine', label: 'توربين', icon: '🌀' },
              { id: 'environmentalVectors', label: 'الرياح والشمس', icon: '🧭' },
              { id: 'cadastre', label: 'شبكة SIG', icon: '📐' },
            ].map((layer) => {
              const active = layers[layer.id as keyof MapLayersState];
              return (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id as keyof MapLayersState)}
                  className={`w-full py-1.5 px-1 rounded flex flex-col items-center justify-center gap-0.5 transition-all focus-visible:outline-2 focus-visible:outline-[#f15b22] ${
                    active
                      ? 'key-inset-pressed text-[#f15b22] font-bold'
                      : 'key-raised text-[#8e9aa0]'
                  }`}
                >
                  <span className="text-base leading-none">{layer.icon}</span>
                  <span className="text-[11px] font-sans leading-tight text-center">
                    {layer.label}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* FLOATING ZOOM & PAN CONTROLS (BOTTOM-LEFT) */}
          <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1 chassis-field-screen p-1 rounded-md shadow-lg border border-[#242d33]">
            <button
              onClick={() => setZoomLevel((z) => Math.min(Number((z + 0.15).toFixed(2)), 2.5))}
              aria-label="تكبير"
              title="تكبير (Ctrl + عجلة الفأرة)"
              className="key-raised w-7 h-7 flex items-center justify-center font-bold text-sm text-[#f2f4f4]"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(Number((z - 0.15).toFixed(2)), 0.5))}
              aria-label="تصغير"
              title="تصغير (Ctrl + عجلة الفأرة)"
              className="key-raised w-7 h-7 flex items-center justify-center font-bold text-sm text-[#f2f4f4]"
            >
              −
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPan({ x: 0, y: 0 });
              }}
              aria-label="إعادة الضبط والتمركز"
              title="إعادة التمركز والضبط على 100%"
              className="key-raised px-2 h-7 flex items-center justify-center font-mono text-[10px] font-bold text-[#f2f4f4]"
            >
              100%
            </button>
          </div>

          {/* FLOATING KPI DRAWER TOGGLE (BOTTOM-RIGHT) */}
          <div className="absolute bottom-3 right-3 z-30 flex items-center gap-2">
            <button
              onClick={() => setShowKpiDeck(!showKpiDeck)}
              className="key-raised px-3 py-1.5 text-xs font-bold text-[#f2f4f4] flex items-center gap-1.5 shadow-lg border-[#242d33]"
            >
              <span>📊</span>
              <span>{showKpiDeck ? 'إخفاء المؤشرات' : 'مؤشرات الأداء'}</span>
            </button>
          </div>

          {/* EXPANDABLE KPI DRAWER */}
          {showKpiDeck && (
            <div className="absolute bottom-12 right-3 z-30 w-80 p-3 chassis-field-screen rounded-lg shadow-2xl border border-[#242d33] grid grid-cols-2 gap-2 animate-in slide-in-from-bottom-2 duration-150">
              <div className="p-2 chassis-well rounded border border-[#222c33]">
                <div className="text-[10px] font-bold text-[#8e9aa0]">مزيج الطاقة</div>
                <div className="text-base font-mono font-bold text-[#f2f4f4]" dir="ltr">
                  {metrics.annualKwh} <span className="text-[10px] text-[#8e9aa0]">kWh/an</span>
                </div>
              </div>
              <div className="p-2 chassis-well rounded border border-[#222c33]">
                <div className="text-[10px] font-bold text-[#8e9aa0]">مسار التبريد</div>
                <div className="text-base font-mono font-bold text-[#f2f4f4]" dir="ltr">
                  {metrics.refrigerantMeters} <span className="text-[10px] text-[#8e9aa0]">m</span>
                </div>
              </div>
              <div className="p-2 chassis-well rounded border border-[#222c33]">
                <div className="text-[10px] font-bold text-[#8e9aa0]">معامل الراحة</div>
                <div className="text-base font-mono font-bold text-[#f2f4f4]" dir="ltr">
                  {metrics.comfortScore} <span className="text-[10px] text-[#8e9aa0]">%</span>
                </div>
              </div>
              <div className="p-2 chassis-well rounded border border-[#222c33]">
                <div className="text-[10px] font-bold text-[#8e9aa0]">الاسترداد (ROI)</div>
                <div className="text-base font-mono font-bold text-[#f2f4f4]" dir="ltr">
                  {metrics.roiYears} <span className="text-[10px] text-[#8e9aa0]">سنوات</span>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC HOVER TOOLTIP (HTML OVERLAY - NEVER OUT OF BOUNDS) */}
          {hoveredElement && (
            <div
              className="pointer-events-none absolute z-50 transition-all duration-75 ease-out"
              style={{
                left: `${mousePos.x}px`,
                top: `${mousePos.y - 14}px`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div
                dir="rtl"
                className="bg-[#090d0f]/95 text-[#f2f4f4] border border-[#f15b22] shadow-[0_8px_24px_rgba(0,0,0,0.85)] rounded-lg px-3 py-2 flex flex-col gap-1 min-w-[200px] max-w-[320px] backdrop-blur-md pointer-events-none"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#242d33] pb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-[#f15b22] shrink-0 animate-pulse" />
                    <span className="text-xs font-bold text-[#f8fafc] truncate">
                      {hoveredElement.name}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-[#f15b22] bg-[#1a2228] px-1 py-0.5 rounded shrink-0">
                    {hoveredElement.category}
                  </span>
                </div>
                <div className="text-[11px] font-sans text-[#94a3b8] leading-tight">
                  {hoveredElement.details}
                </div>
              </div>
            </div>
          )}

          {/* MAIN VECTOR CANVAS WITH NORMAL CURSOR */}
          <main
            className={`w-full h-full flex items-center justify-center overflow-hidden ${
              isDragging ? 'cursor-grabbing' : 'cursor-default'
            }`}
            role="region"
            aria-label="مخطط الطاقة المعماري التفاعلي"
          >
            <div
              className="transition-transform duration-75 ease-out p-4 select-none"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                transformOrigin: 'center center',
              }}
            >
              <svg
                id="sketch-svg"
                width="880"
                height="660"
                viewBox="0 0 880 660"
                className="overflow-visible bg-[#0d1215] rounded-lg border border-[#242d33] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              >
                <defs>
                  {/* PATTERN: Solar PV Cells */}
                  <pattern id="pvCellPattern" width="12" height="12" patternUnits="userSpaceOnUse">
                    <rect width="12" height="12" fill="#0d2b45" />
                    <line x1="0" y1="0" x2="12" y2="0" stroke="#2563eb" strokeWidth="0.5" />
                    <line x1="0" y1="0" x2="0" y2="12" stroke="#2563eb" strokeWidth="0.5" />
                    <line x1="6" y1="0" x2="6" y2="12" stroke="#38bdf8" strokeWidth="0.3" strokeDasharray="1 2" />
                  </pattern>

                  {/* PATTERN: Ground PV */}
                  <pattern id="groundPvPattern" width="8" height="8" patternUnits="userSpaceOnUse">
                    <rect width="8" height="8" fill="#0369a1" />
                    <line x1="0" y1="0" x2="8" y2="0" stroke="#bae6fd" strokeWidth="0.5" />
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#bae6fd" strokeWidth="0.5" />
                  </pattern>

                  {/* PATTERN: Interior Floor Tile */}
                  <pattern id="floorTilePattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="#1e262b" />
                    <line x1="20" y1="0" x2="20" y2="20" stroke="#2a3339" strokeWidth="0.5" />
                    <line x1="0" y1="20" x2="20" y2="20" stroke="#2a3339" strokeWidth="0.5" />
                  </pattern>

                  {/* MARKER: Wind Direction Arrowhead */}
                  <marker id="windArrowHead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#38bdf8" />
                  </marker>

                  {/* GRADIENTS: Sun on Top with Fading Projection Cone */}
                  <radialGradient id="sunGlowTop" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="25%" stopColor="#fef08a" stopOpacity="0.95" />
                    <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                  </radialGradient>

                  <linearGradient id="sunFadeCone" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                    <stop offset="22%" stopColor="#fbbf24" stopOpacity="0.22" />
                    <stop offset="55%" stopColor="#fde047" stopOpacity="0.08" />
                    <stop offset="90%" stopColor="#fde047" stopOpacity="0.0" />
                  </linearGradient>

                  {/* GRADIENTS: Continuous Magma Thermal Plumes */}
                  <radialGradient id="thermalPlumeAC1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.92" />
                    <stop offset="25%" stopColor="#f97316" stopOpacity="0.75" />
                    <stop offset="55%" stopColor="#dc2626" stopOpacity="0.52" />
                    <stop offset="78%" stopColor="#7e22ce" stopOpacity="0.32" />
                    <stop offset="92%" stopColor="#1e1b4b" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#182024" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="thermalPlumeAC2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.92" />
                    <stop offset="25%" stopColor="#f97316" stopOpacity="0.75" />
                    <stop offset="55%" stopColor="#dc2626" stopOpacity="0.52" />
                    <stop offset="78%" stopColor="#7e22ce" stopOpacity="0.32" />
                    <stop offset="92%" stopColor="#1e1b4b" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#182024" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="thermalPlumeAC3" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                    <stop offset="28%" stopColor="#f97316" stopOpacity="0.78" />
                    <stop offset="58%" stopColor="#dc2626" stopOpacity="0.55" />
                    <stop offset="80%" stopColor="#7e22ce" stopOpacity="0.35" />
                    <stop offset="94%" stopColor="#1e1b4b" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#182024" stopOpacity="0" />
                  </radialGradient>

                  {/* Clip Path: House Interior Room Boundary */}
                  <clipPath id="houseInteriorClip">
                    <rect x="220" y="200" width="440" height="260" rx="2" />
                  </clipPath>
                </defs>

                {/* 1. CADASTRE GRID (0.25M) */}
                {layers.cadastre && (
                  <g stroke="#263138" strokeWidth="0.5">
                    {Array.from({ length: 23 }).map((_, i) => (
                      <line key={`gx-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="660" />
                    ))}
                    {Array.from({ length: 17 }).map((_, i) => (
                      <line key={`gy-${i}`} x1="0" y1={i * 40} x2="880" y2={i * 40} />
                    ))}
                  </g>
                )}

                {/* 2. SUN ON TOP & FADING PROJECTION CONE */}
                {(layers.environmentalVectors || layers.solarPv) && (
                  <g pointerEvents="none">
                    {/* Volumetric Fading Sun Cone (Projecting Downward Across the Plot) */}
                    <polygon
                      points="440,35 60,620 820,620"
                      fill="url(#sunFadeCone)"
                    />

                    {/* Boundary Ray Guidelines Fading Downwards */}
                    <line x1="440" y1="35" x2="60" y2="620" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" />
                    <line x1="440" y1="35" x2="820" y2="620" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" />

                    {/* Direct Solar Incidence Ray Lines */}
                    <line x1="440" y1="35" x2="160" y2="100" stroke="#fde047" strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.4" />
                    <line x1="440" y1="35" x2="330" y2="240" stroke="#fde047" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.5" />
                    <line x1="440" y1="35" x2="440" y2="240" stroke="#fde047" strokeWidth="2" strokeDasharray="8 4" strokeOpacity="0.6" />
                    <line x1="440" y1="35" x2="550" y2="240" stroke="#fde047" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.5" />

                    {/* Radiant Sun Celestial Body on Top Center */}
                    <g transform="translate(440, 35)">
                      <circle cx="0" cy="0" r="26" fill="#f59e0b" fillOpacity="0.2" />
                      <circle cx="0" cy="0" r="18" fill="url(#sunGlowTop)" stroke="#fde047" strokeWidth="2" filter="drop-shadow(0 0 8px #f59e0b)" />
                      {/* Corona Spikes */}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <line
                          key={`sray-${i}`}
                          x1="0"
                          y1="-22"
                          x2="0"
                          y2="-28"
                          stroke="#fde047"
                          strokeWidth="2"
                          strokeLinecap="round"
                          transform={`rotate(${i * 45})`}
                        />
                      ))}
                      <text x="0" y="32" fill="#fde047" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="var(--dp-typography-sans)">
                        ☀️ الشمس (181° S • 49° Alt)
                      </text>
                    </g>
                  </g>
                )}

                {/* 3. OBSTACLES (TREES & BOUNDARY) */}
                {layers.obstacles && (
                  <g>
                    {/* Tree West */}
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredElement({
                          name: 'شجرة بلوط غربية',
                          category: 'حواجز طبيعية',
                          details: 'ارتفاع 7.5 م • حجب ظلال 2.1%',
                          x: 110,
                          y: 310,
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                      onClick={() =>
                        setSelectedItem({
                          title: 'شجرة بلوط غربية (حاجز ظلال)',
                          category: 'حواجز طبيعية',
                          icon: '🌳',
                          kpis: [
                            { label: 'الارتفاع', value: '7.5 م' },
                            { label: 'المسافة عن السقف', value: '6.2 م' },
                            { label: 'نسبة الحجب', value: '2.1%' },
                            { label: 'التأثير السنوي', value: '-240 kWh' },
                          ],
                          diagnostic: 'تقليم خفيف بمقدار 1.5م يستعيد الإنتاج الأقصى.',
                        })
                      }
                    >
                      <circle cx="110" cy="310" r="38" fill="#142c1f" stroke="#10b981" strokeWidth="1.5" />
                      <circle cx="110" cy="310" r="24" fill="#1a3d2b" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx="110" cy="310" r="4" fill="#10b981" />
                    </g>

                    {/* Tree South */}
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredElement({
                          name: 'شجرة حديقة جنوبية',
                          category: 'حواجز طبيعية',
                          details: 'ارتفاع 6.0 م • لا تشكل ظلالاً على السقف',
                          x: 290,
                          y: 530,
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      <circle cx="290" cy="530" r="42" fill="#142c1f" stroke="#10b981" strokeWidth="1.5" />
                      <circle cx="290" cy="530" r="26" fill="#1a3d2b" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx="290" cy="530" r="4" fill="#10b981" />
                    </g>

                    {/* Tree North-East */}
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredElement({
                          name: 'شجرة صنوبر شمالية شرقية',
                          category: 'حواجز طبيعية',
                          details: 'ارتفاع 8.0 م • مصد رياح طبيعي',
                          x: 720,
                          y: 120,
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      <circle cx="720" cy="120" r="40" fill="#142c1f" stroke="#10b981" strokeWidth="1.5" />
                      <circle cx="720" cy="120" r="25" fill="#1a3d2b" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx="720" cy="120" r="4" fill="#10b981" />
                    </g>

                    {/* Neighbor Building East */}
                    <rect
                      x="750"
                      y="230"
                      width="65"
                      height="180"
                      fill="#1d262b"
                      stroke="#475569"
                      strokeWidth="1.5"
                      rx="2"
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredElement({
                          name: 'مبنى مجاور شرقي',
                          category: 'محيط عقاري',
                          details: 'ارتفاع R+1 (6.5 م) • مسافة 12 م',
                          x: 780,
                          y: 320,
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                    />
                  </g>
                )}

                {/* 4. HOUSE ARCHITECTURE (CLEAN WALLS, FLOORS, MAGMA HEATMAP) */}
                {layers.walls && (
                  <g>
                    {/* Interior Floor Base */}
                    <rect
                      x="220"
                      y="200"
                      width="440"
                      height="260"
                      fill="url(#floorTilePattern)"
                      stroke="#37434a"
                      strokeWidth="1"
                      rx="2"
                    />

                    {/* Continuous Magma Thermal Gradient Plumes (Indoor HVAC Distribution) */}
                    {layers.thermalEfficiencyHeatmap && (
                      <g clipPath="url(#houseInteriorClip)">
                        <rect x="220" y="200" width="440" height="260" fill="#1e1b4b" fillOpacity="0.22" />
                        {/* AC1 Master Suite Plume */}
                        <ellipse cx="280" cy="330" rx="115" ry="95" fill="url(#thermalPlumeAC1)" />
                        {/* AC2 Kitchen / Dining Plume */}
                        <ellipse cx="580" cy="270" rx="135" ry="85" fill="url(#thermalPlumeAC2)" />
                        {/* AC3 Living Room Plume */}
                        <ellipse cx="580" cy="420" rx="140" ry="95" fill="url(#thermalPlumeAC3)" />
                      </g>
                    )}

                    {/* Interactive Floor Rooms with Clean Hover */}
                    <rect
                      x="220"
                      y="200"
                      width="160"
                      height="260"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredElement({
                          name: 'جناح النوم الرئيسي (Suite)',
                          category: 'فضاء داخلي',
                          details: 'مساحة 38 م² • تكييف كاسيت AC1',
                          x: 300,
                          y: 310,
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                    />
                    <rect
                      x="380"
                      y="200"
                      width="280"
                      height="130"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredElement({
                          name: 'المطبخ وتناول الطعام',
                          category: 'فضاء داخلي',
                          details: 'مساحة 44 م² • تكييف كاسيت AC2',
                          x: 520,
                          y: 260,
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                    />
                    <rect
                      x="380"
                      y="330"
                      width="280"
                      height="130"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredElement({
                          name: 'غرفة المعيشة والاستقبال',
                          category: 'فضاء داخلي',
                          details: 'مساحة 58 م² • تكييف كاسيت AC3',
                          x: 520,
                          y: 400,
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                    />

                    {/* Outer Perimeter Walls */}
                    <rect x="216" y="196" width="448" height="268" fill="none" stroke="#e2e8f0" strokeWidth="7" />

                    {/* Windows with Clean Cyan Accents */}
                    <line x1="300" y1="196" x2="380" y2="196" stroke="#38bdf8" strokeWidth="7" className="cursor-pointer" onMouseEnter={() => setHoveredElement({ name: 'نافذة شمالية مزدوجة', category: 'فتحة معمارية', details: 'عزل حراري عالي U=1.1', x: 340, y: 196 })} onMouseLeave={() => setHoveredElement(null)} />
                    <line x1="500" y1="196" x2="590" y2="196" stroke="#38bdf8" strokeWidth="7" className="cursor-pointer" onMouseEnter={() => setHoveredElement({ name: 'نافذة مطبخ شمالية', category: 'فتحة معمارية', details: 'عزل حراري عالي U=1.1', x: 545, y: 196 })} onMouseLeave={() => setHoveredElement(null)} />
                    <line x1="280" y1="464" x2="370" y2="464" stroke="#38bdf8" strokeWidth="7" className="cursor-pointer" onMouseEnter={() => setHoveredElement({ name: 'نافذة جنوبية مشمسة', category: 'فتحة معمارية', details: 'كسب حراري شمسي شتوي', x: 325, y: 464 })} onMouseLeave={() => setHoveredElement(null)} />
                    <line x1="460" y1="464" x2="580" y2="464" stroke="#38bdf8" strokeWidth="7" className="cursor-pointer" onMouseEnter={() => setHoveredElement({ name: 'باب شرفة زجاجي منزلق', category: 'فتحة معمارية', details: 'عرض 3 م • استقطاب شمسي', x: 520, y: 464 })} onMouseLeave={() => setHoveredElement(null)} />
                    <line x1="216" y1="270" x2="216" y2="340" stroke="#38bdf8" strokeWidth="7" />
                    <line x1="664" y1="260" x2="664" y2="350" stroke="#38bdf8" strokeWidth="7" />

                    {/* Interior Partition Walls */}
                    <line x1="380" y1="200" x2="380" y2="310" stroke="#94a3b8" strokeWidth="5" />
                    <line x1="380" y1="370" x2="380" y2="460" stroke="#94a3b8" strokeWidth="5" />
                    <line x1="380" y1="330" x2="500" y2="330" stroke="#94a3b8" strokeWidth="5" />
                    <line x1="550" y1="330" x2="660" y2="330" stroke="#94a3b8" strokeWidth="5" />
                  </g>
                )}

                {/* 5. HVAC PIPING & CASSETTES */}
                {layers.hvacUnits && (
                  <g>
                    {/* Cyan Refrigerant Piping */}
                    <path
                      d="M 410 480 L 410 420 L 380 420 L 380 330 L 280 330 M 410 420 L 580 420 L 580 270"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="6 3"
                    />

                    {/* Outdoor Condenser (PAC) */}
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredElement({
                          name: 'وحدة التكثيف الخارجية PAC',
                          category: 'تكييف HVAC',
                          details: 'قدرة 9.0 kW • معامل COP 4.2 • ضجيج 38 dB(A)',
                          x: 410,
                          y: 475,
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                      onClick={() =>
                        setSelectedItem({
                          title: 'مضخة حرارية PAC (مكثف خارجي)',
                          category: 'تكييف HVAC',
                          icon: '❄️',
                          kpis: [
                            { label: 'القدرة', value: '9.0 kW' },
                            { label: 'المعامل COP', value: '4.2' },
                            { label: 'مسار التبريد', value: '29 م' },
                            { label: 'مستوى الضجيج', value: '38 dB(A)' },
                          ],
                          diagnostic: 'موقع جنوبي محمي يقلل فقدان الضغط وسريان المائع R32.',
                        })
                      }
                    >
                      <rect x="395" y="475" width="34" height="26" fill="#e7eaeb" stroke="#181e22" strokeWidth="2" rx="3" />
                      <circle cx="412" cy="488" r="8" fill="#cbd0d2" stroke="#181e22" strokeWidth="1" />
                      <line x1="406" y1="488" x2="418" y2="488" stroke="#f15b22" strokeWidth="1.5" />
                      <line x1="412" y1="482" x2="412" y2="494" stroke="#f15b22" strokeWidth="1.5" />
                    </g>

                    {/* Indoor AC Ceiling Cassettes */}
                    {[
                      { id: 'AC1', cx: 280, cy: 330, kw: '2.5 kW', room: 'الجناح الرئيسي' },
                      { id: 'AC2', cx: 580, cy: 270, kw: '3.5 kW', room: 'المطبخ والصالة' },
                      { id: 'AC3', cx: 580, cy: 420, kw: '4.0 kW', room: 'غرفة المعيشة' },
                    ].map((ac) => (
                      <g
                        key={ac.id}
                        className="cursor-pointer"
                        onMouseEnter={() =>
                          setHoveredElement({
                            name: `كاسيت سقفية داخلية ${ac.id}`,
                            category: 'تكييف وتدفئة HVAC',
                            details: `${ac.room} • قدرة ${ac.kw}`,
                            x: ac.cx,
                            y: ac.cy,
                          })
                        }
                        onMouseLeave={() => setHoveredElement(null)}
                        onClick={() =>
                          setSelectedItem({
                            title: `وحدة سقفية داخلية ${ac.id}`,
                            category: 'تكييف وتدفئة HVAC',
                            icon: '❄️',
                            kpis: [
                              { label: 'المكان', value: ac.room },
                              { label: 'القدرة', value: ac.kw },
                              { label: 'تدفق الهواء', value: '580 m³/h' },
                              { label: 'معامل الكفاءة', value: '0.58 / 0.60' },
                            ],
                            diagnostic: 'توزيع حراري متوازن بدون مناطق ركود هوائي.',
                          })
                        }
                      >
                        <rect x={ac.cx - 15} y={ac.cy - 10} width="30" height="20" fill="#f8fafc" stroke="#0ea5e9" strokeWidth="1.5" rx="2" />
                        <line x1={ac.cx - 10} y1={ac.cy} x2={ac.cx + 10} y2={ac.cy} stroke="#0284c7" strokeWidth="1" />
                        <circle cx={ac.cx + 9} cy={ac.cy - 5} r="2" fill="#10b981" />
                      </g>
                    ))}
                  </g>
                )}

                {/* 6. SOLAR PHOTOVOLTAIC (ROOF & GROUND PV ARRAYS) */}
                {layers.solarPv && (
                  <g>
                    {/* Roof Array (Row 1 - 9 modules, Row 2 - 11 modules) */}
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredElement({
                          name: 'مصفوفة السقف الكهروضوئية',
                          category: 'طاقة شمسية PV',
                          details: '20 لوح أحادي البلورة (425 Wc) • قدرة 8.5 kWc',
                          x: 360,
                          y: 230,
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                      onClick={() =>
                        setSelectedItem({
                          title: 'مصفوفة السقف (20 لوح أحادي البلورة)',
                          category: 'طاقة شمسية PV',
                          icon: '☀️',
                          kpis: [
                            { label: 'القدرة الإجمالية', value: '8.5 kWc' },
                            { label: 'التوجيه', value: 'جنوب 180°' },
                            { label: 'الميلان', value: '30°' },
                            { label: 'الإنتاج السنوي', value: '13 416 kWh/an' },
                          ],
                          diagnostic: 'سطح مثالي بدون ظلال مع تهوية خلفية ممتازة.',
                        })
                      }
                    >
                      {Array.from({ length: 9 }).map((_, i) => (
                        <rect
                          key={`roof-r1-${i}`}
                          x={260 + i * 22}
                          y={220}
                          width="19"
                          height="28"
                          fill="url(#pvCellPattern)"
                          stroke="#60a5fa"
                          strokeWidth="1"
                          rx="1"
                        />
                      ))}
                      {Array.from({ length: 11 }).map((_, i) => (
                        <rect
                          key={`roof-r2-${i}`}
                          x={245 + i * 22}
                          y={255}
                          width="19"
                          height="28"
                          fill="url(#pvCellPattern)"
                          stroke="#60a5fa"
                          strokeWidth="1"
                          rx="1"
                        />
                      ))}
                    </g>

                    {/* Ground Array (6 modules in North-West clear zone) */}
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredElement({
                          name: 'حقل الطاقة الشمسية الأرضي',
                          category: 'طاقة شمسية PV',
                          details: '6 ألواح أرضية (425 Wc) • قدرة 2.55 kWc • ميل 35°',
                          x: 175,
                          y: 75,
                        })
                      }
                      onMouseLeave={() => setHoveredElement(null)}
                      onClick={() =>
                        setSelectedItem({
                          title: 'حقل شمسي أرضي (6 ألواح)',
                          category: 'طاقة شمسية PV',
                          icon: '☀️',
                          kpis: [
                            { label: 'القدرة', value: '2.55 kWc' },
                            { label: 'التوجيه', value: 'جنوب 180°' },
                            { label: 'الميلان', value: '35° مثالي' },
                            { label: 'الإنتاج', value: '3 840 kWh/an' },
                          ],
                          diagnostic: 'أقصى تعرض شمسي على مدار الفصول الأربعة.',
                        })
                      }
                    >
                      {Array.from({ length: 6 }).map((_, i) => (
                        <rect
                          key={`ground-${i}`}
                          x={80 + i * 36}
                          y={65}
                          width="30"
                          height="22"
                          fill="url(#groundPvPattern)"
                          stroke="#38bdf8"
                          strokeWidth="1"
                          rx="1"
                        />
                      ))}
                    </g>
                  </g>
                )}

                {/* 7. WIND TURBINE */}
                {layers.windTurbine && (
                  <g
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredElement({
                        name: 'توربين رياح سكني مصغر',
                        category: 'طاقة رياح',
                        details: 'قدرة 1.5 kWc • سرعة بدء 2.5 m/s',
                        x: 350,
                        y: 80,
                      })
                    }
                    onMouseLeave={() => setHoveredElement(null)}
                    onClick={() =>
                      setSelectedItem({
                        title: 'توربين رياح سكني مصغر',
                        category: 'طاقة رياح',
                        icon: '🌀',
                        kpis: [
                          { label: 'القدرة الاسمية', value: '1.5 kW' },
                          { label: 'سرعة البدء', value: '2.5 m/s' },
                          { label: 'الاتجاه السائد', value: '301°' },
                          { label: 'الإنتاج السنوي', value: '1 980 kWh/an' },
                        ],
                        diagnostic: 'محاذاة كاملة في اتجاه مسار الرياح السائدة.',
                      })
                    }
                  >
                    <line x1="350" y1="120" x2="350" y2="80" stroke="#94a3b8" strokeWidth="3" />
                    <circle cx="350" cy="80" r="5" fill="#10b981" stroke="#f8fafc" strokeWidth="1.5" />
                    <line x1="350" y1="80" x2="350" y2="55" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="350" y1="80" x2="328" y2="92" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="350" y1="80" x2="372" y2="92" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                )}

                {/* 8. WIND DIRECTION: EXACTLY 4 PARALLEL ARROWS EQUALLY DISTANCED AT NW CORNER OF HOUSE */}
                {layers.environmentalVectors && (
                  <g pointerEvents="none">
                    {/* Arrow 1 */}
                    <line
                      x1="80"
                      y1="95"
                      x2="155"
                      y2="140"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="6 3"
                      markerEnd="url(#windArrowHead)"
                    />
                    {/* Arrow 2 */}
                    <line
                      x1="98"
                      y1="125"
                      x2="173"
                      y2="170"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="6 3"
                      markerEnd="url(#windArrowHead)"
                    />
                    {/* Arrow 3 */}
                    <line
                      x1="116"
                      y1="155"
                      x2="191"
                      y2="200"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="6 3"
                      markerEnd="url(#windArrowHead)"
                    />
                    {/* Arrow 4 */}
                    <line
                      x1="134"
                      y1="185"
                      x2="209"
                      y2="230"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="6 3"
                      markerEnd="url(#windArrowHead)"
                    />

                    {/* Wind Badge next to the 4 arrows */}
                    <g transform="translate(65, 60)">
                      <rect x="0" y="0" width="100" height="20" rx="3" fill="#0f172a" fillOpacity="0.9" stroke="#0284c7" strokeWidth="1" />
                      <text x="8" y="14" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="var(--dp-typography-sans)">
                        💨 رياح 301°
                      </text>
                    </g>
                  </g>
                )}

              </svg>
            </div>
          </main>
        </div>

        {/* 3. ULTRA MINIMAL FOOTER - UNIFIED DARK MODE */}
        <footer className="chassis-seam-horizontal bg-[#12171b] px-3 py-1.5 flex items-center justify-between text-[11px] font-sans text-[#8e9aa0] border-t border-[#242d33]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#f2f4f4]">HELIOS-VEKTOR v2.4</span>
            <span>•</span>
            <span>معتمد وفق معيار RE2020 / CSTB</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[#8e9aa0]" dir="ltr">
            <span>SIG: EPSG:4326</span>
            <span>BIM: IFC 4.0</span>
          </div>
        </footer>
      </div>

      {/* MODALS */}
      <ConfigImportModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onLaunchOptimization={triggerIaRecalculation}
        equipmentMode={equipmentMode}
        onSelectMode={setEquipmentMode}
        noiseLimit={noiseLimit}
        onChangeNoiseLimit={setNoiseLimit}
      />

      <EnergyReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
};
