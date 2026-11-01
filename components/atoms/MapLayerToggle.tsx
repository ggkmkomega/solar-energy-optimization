'use client';

import React from 'react';

interface MapLayerToggleProps {
  id: string;
  name: string;
  active: boolean;
  colorHex: string;
  count?: number;
  onChange: (id: string, active: boolean) => void;
}

export const MapLayerToggle: React.FC<MapLayerToggleProps> = ({
  id,
  name,
  active,
  colorHex,
  count,
  onChange,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => onChange(id, !active)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded text-[13px] font-sans font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f15b22] ${
        active
          ? 'key-inset-pressed text-[#181e22] font-semibold'
          : 'key-raised text-[#414b52] hover:text-[#181e22]'
      }`}
    >
      <div className="flex items-center gap-2.5 truncate">
        <span
          className={`w-2.5 h-2.5 rounded-full border border-black/40 flex-shrink-0 transition-opacity ${
            active ? 'shadow-[0_0_6px_rgba(241,91,34,0.6)]' : 'opacity-35 grayscale'
          }`}
          style={{ backgroundColor: active ? colorHex : '#6b777e' }}
          aria-hidden="true"
        />
        <span className="truncate">{name}</span>
      </div>
      {typeof count === 'number' && (
        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#b6bec2] text-[#181e22] font-bold border border-[#9ea8ad] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.2)]">
          {count}
        </span>
      )}
    </button>
  );
};
