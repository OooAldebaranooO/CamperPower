import { Injectable } from '@angular/core';
import { ApplianceInput, EnergyResult } from '../models/energy.model';

@Injectable({
  providedIn: 'root',
})
export class EnergyCalculatorService {
  calculate(
    appliances: ApplianceInput[],
    batteryVoltage = 12,
    batteryAutonomyDays = 1,
    batteryDepthOfDischarge = 0.8,
    solarProductionHours = 4,
    systemLossFactor = 1.2
  ): EnergyResult {
    const totalWhPerDay = appliances.reduce((sum, appliance) => {
      const itemWh =
        appliance.power *
        appliance.hoursPerDay *
        appliance.quantity;

      return sum + itemWh;
    }, 0);

    const adjustedWhPerDay = totalWhPerDay * systemLossFactor;

    const recommendedBatteryAh =
      (adjustedWhPerDay * batteryAutonomyDays) /
      (batteryVoltage * batteryDepthOfDischarge);

    const recommendedSolarW =
      adjustedWhPerDay / solarProductionHours;

    const recommendedInverterW = appliances.reduce((max, appliance) => {
      const startupFactor = appliance.startupFactor ?? 1;
      const neededPower = appliance.power * appliance.quantity * startupFactor;
      return Math.max(max, neededPower);
    }, 0);

    return {
      totalWhPerDay: Math.round(totalWhPerDay),
      recommendedBatteryAh: Math.ceil(recommendedBatteryAh),
      recommendedSolarW: Math.ceil(recommendedSolarW),
      recommendedInverterW: Math.ceil(recommendedInverterW),
    };
  }
}