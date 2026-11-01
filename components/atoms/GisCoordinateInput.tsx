'use client';

import React, { useState } from 'react';

interface GisCoordinateInputProps {
  label: string;
  latitude: number;
  longitude: number;
  onChange: (coords: { lat: number; lng: number }) => void;
  disabled?: boolean;
}

export const GisCoordinateInput: React.FC<GisCoordinateInputProps> = ({
  label,
  latitude,
  longitude,
  onChange,
  disabled = false,
}) => {
  const [lat, setLat] = useState(latitude.toFixed(6));
  const [lng, setLng] = useState(longitude.toFixed(6));

  const handleBlur = () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      onChange({ lat: parsedLat, lng: parsedLng });
    }
  };

  return (
    <div className="flex flex-col gap-1.5 font-sans">
      <div className="flex items-center justify-between text-xs font-semibold text-[#8e9aa0]">
        <label className="engraved-label text-[#8e9aa0]">{label}</label>
        <span className="font-mono text-[10px] text-[#8e9aa0] bg-[#0d1215] px-1.5 py-0.5 rounded border border-[#222c33]" dir="ltr">
          EPSG:4326
        </span>
      </div>
      <div className="flex items-center gap-1.5 bg-[#090d0f] border border-[#1a2228] rounded p-1 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]" dir="ltr">
        <div className="flex-1 flex items-center gap-1.5 px-2 py-0.5 border-r border-[#313c42]">
          <span className="text-[10px] font-mono text-[#d8dee1] font-bold">LAT</span>
          <input
            type="text"
            value={lat}
            disabled={disabled}
            onChange={(e) => setLat(e.target.value)}
            onBlur={handleBlur}
            aria-label="خط العرض"
            className="w-full bg-transparent text-[13px] font-mono font-medium text-[#f2f4f4] outline-none focus:text-[#f15b22] focus-visible:outline-none"
          />
        </div>
        <div className="flex-1 flex items-center gap-1.5 px-2 py-0.5">
          <span className="text-[10px] font-mono text-[#d8dee1] font-bold">LNG</span>
          <input
            type="text"
            value={lng}
            disabled={disabled}
            onChange={(e) => setLng(e.target.value)}
            onBlur={handleBlur}
            aria-label="خط الطول"
            className="w-full bg-transparent text-[13px] font-mono font-medium text-[#f2f4f4] outline-none focus:text-[#f15b22] focus-visible:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
