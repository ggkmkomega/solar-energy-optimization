'use client';

import React, { useState } from 'react';
import { GisCoordinateInput } from '@/components/atoms/GisCoordinateInput';
import { HvacToleranceSlider } from '@/components/atoms/HvacToleranceSlider';
import { EquipmentSelector } from '@/components/molecules/EquipmentSelector';
import { EquipmentMode } from '@/types/energy';

interface ConfigImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchOptimization: () => void;
  equipmentMode: EquipmentMode;
  onSelectMode: (mode: EquipmentMode) => void;
  noiseLimit: number;
  onChangeNoiseLimit: (val: number) => void;
}

export const ConfigImportModal: React.FC<ConfigImportModalProps> = ({
  isOpen,
  onClose,
  onLaunchOptimization,
  equipmentMode,
  onSelectMode,
  noiseLimit,
  onChangeNoiseLimit,
}) => {
  const [address, setAddress] = useState('14 Chemin des Hautes Roches, 78460 Chevreuse');
  const [coords, setCoords] = useState({ lat: 48.712491, lng: 2.04183 });
  const [buildingType, setBuildingType] = useState('residentiel');
  const [usefulArea, setUsefulArea] = useState('185');

  if (!isOpen) return null;

  const handleApply = () => {
    onClose();
    onLaunchOptimization();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
    >
      <div className="instrument-housing w-full max-w-2xl p-5 sm:p-6 flex flex-col gap-4 text-[#f2f4f4] shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#2a353c]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 chassis-seam-horizontal">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">⚙️</span>
            <div>
              <h2 id="settings-modal-title" className="text-base sm:text-lg font-bold text-[#f2f4f4]">
                إعدادات المحاكاة والمعدات
              </h2>
              <p className="text-xs text-[#8e9aa0]">
                تعديل بارامترات الموقع، حدود الضجيج ونمط التحسين
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="إغلاق الإعدادات"
            className="key-raised w-8 h-8 flex items-center justify-center font-bold text-sm text-[#f2f4f4] focus-visible:outline-2 focus-visible:outline-[#f15b22]"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {/* 1. Equipment Mode */}
          <div className="flex flex-col gap-1.5 p-3 chassis-raised rounded-md border border-[#2d3840]">
            <span className="engraved-label !text-[11px] text-[#f2f4f4]">
              أداة التعديل والمعدات النشطة
            </span>
            <EquipmentSelector
              currentMode={equipmentMode}
              onSelectMode={onSelectMode}
            />
          </div>

          {/* 2. HVAC Noise Tolerance */}
          <div className="p-3 chassis-raised rounded-md border border-[#2d3840]">
            <HvacToleranceSlider
              label="حد ضجيج المكثف الخارجي (PAC)"
              min={25}
              max={45}
              unit="dB(A)"
              value={noiseLimit}
              onChange={onChangeNoiseLimit}
            />
          </div>

          {/* 3. Building & Area */}
          <div className="grid grid-cols-2 gap-3 p-3 chassis-raised rounded-md border border-[#2d3840]">
            <div className="flex flex-col gap-1">
              <label className="engraved-label !text-[10px] text-[#8e9aa0]">نوع المبنى</label>
              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                className="bg-[#090d0f] border border-[#1a2228] rounded px-2.5 py-1.5 text-xs text-[#f2f4f4] font-sans focus:outline-none focus:text-[#f15b22] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] focus-visible:outline-2 focus-visible:outline-[#f15b22]"
              >
                <option value="residentiel">سكني فردي</option>
                <option value="collectif">سكني جماعي</option>
                <option value="tertiaire">تجاري / مكتبي</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="engraved-label !text-[10px] text-[#8e9aa0]">المساحة المفيدة (m²)</label>
              <input
                type="number"
                value={usefulArea}
                onChange={(e) => setUsefulArea(e.target.value)}
                className="bg-[#090d0f] border border-[#1a2228] rounded px-2.5 py-1.5 text-xs text-[#f2f4f4] font-mono focus:outline-none focus:text-[#f15b22] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] focus-visible:outline-2 focus-visible:outline-[#f15b22]"
                dir="ltr"
              />
            </div>
          </div>

          {/* 4. GIS Coordinates */}
          <div className="p-3 chassis-raised rounded-md border border-[#2d3840] flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="engraved-label !text-[10px] text-[#8e9aa0]">
                عنوان الموقع
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#090d0f] border border-[#1a2228] rounded px-3 py-1.5 text-xs text-[#f2f4f4] focus:outline-none focus:text-[#f15b22] font-mono shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] focus-visible:outline-2 focus-visible:outline-[#f15b22]"
                dir="ltr"
              />
            </div>

            <GisCoordinateInput
              label="إحداثيات SIG (GPS)"
              latitude={coords.lat}
              longitude={coords.lng}
              onChange={setCoords}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2.5 chassis-seam-horizontal">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#8e9aa0] hover:text-[#f2f4f4] transition-colors focus-visible:outline-2 focus-visible:outline-[#f15b22]"
          >
            إلغاء
          </button>
          <button
            onClick={handleApply}
            className="key-raised px-5 py-2 text-xs font-bold text-[#f2f4f4] border-[#38464f] flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[#f15b22]"
          >
            <span className="w-2 h-2 rounded-full bg-[#f15b22]" aria-hidden="true" />
            <span>تطبيق وإعادة الحساب ←</span>
          </button>
        </div>
      </div>
    </div>
  );
};
