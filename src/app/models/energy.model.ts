export interface ApplianceInput {
  name: string;
  power: number;
  hoursPerDay: number;
  quantity: number;
  startupFactor?: number;
}

export interface EnergyResult {
  totalWhPerDay: number;
  recommendedBatteryAh: number;
  recommendedSolarW: number;
  recommendedInverterW: number;
}