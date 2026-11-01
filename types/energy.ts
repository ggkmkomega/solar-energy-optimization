export type EquipmentMode = 'solar-pv' | 'hvac-pac' | 'storage-battery' | 'wind-turbine';

export type EnergyStatusType = 'optimal' | 'moderate' | 'degraded' | 'warning' | 'computing';

export interface MapLayersState {
  cadastre: boolean;
  walls: boolean;
  environmentalVectors: boolean; // Wind 301°, Sun az 181° el 49°
  thermalEfficiencyHeatmap: boolean; // Indoor plume (0.0 to 0.6)
  hvacUnits: boolean; // Indoor ceiling AC1, AC2, AC3 + Condenser + 29m lines
  solarPv: boolean; // 20 Roof PV + 6 Ground PV
  windTurbine: boolean; // Small wind turbine
  obstacles: boolean; // Trees & neighbor structures
}

export interface IndoorAcUnit {
  id: string; // 'AC1' | 'AC2' | 'AC3'
  x: number;
  y: number;
  label: string;
  room: string;
  coolingKw: number;
  efficiencyScore: number;
}

export interface PvModuleGroup {
  id: string;
  type: 'roof' | 'ground';
  count: number;
  ratedPowerWc: number;
  annualKwh: number;
  azimuthDeg: number;
  tiltDeg: number;
}

export interface WindTurbineSpec {
  id: string;
  x: number;
  y: number;
  powerKw: number;
  rotorDiameterM: number;
  annualKwh: number;
}

export interface SimulationModelData {
  annualYieldKwh: number; // 17256
  refrigerantLengthM: number; // 29
  windDeg: number; // 301
  sunAzimuthDeg: number; // 181
  sunElevationDeg: number; // 49
  indoorUnits: IndoorAcUnit[];
  condenser: { x: number; y: number; powerKw: number; noiseDb: number };
  roofPvCount: number; // 20
  groundPvCount: number; // 6
  windTurbine: WindTurbineSpec;
}
