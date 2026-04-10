import { Injectable, signal } from '@angular/core';
import { ApplianceInput, EnergyResult } from '../models/energy.model';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private readonly configKey = 'vechline-config';
  private readonly resultKey = 'vechline-result';
  private readonly langKey = 'vechline-lang';

  result = signal<EnergyResult | null>(null);

  saveConfig(config: unknown): void {
    localStorage.setItem(this.configKey, JSON.stringify(config));
  }

  loadConfig(): any | null {
    const value = localStorage.getItem(this.configKey);
    return value ? JSON.parse(value) : null;
  }

  saveResult(result: EnergyResult): void {
    localStorage.setItem(this.resultKey, JSON.stringify(result));
    this.result.set(result);
  }

  loadResult(): EnergyResult | null {
    const value = localStorage.getItem(this.resultKey);
    const parsed = value ? JSON.parse(value) : null;
    this.result.set(parsed);
    return parsed;
  }

  saveLanguage(lang: string): void {
    localStorage.setItem(this.langKey, lang);
  }

  loadLanguage(): string {
    return localStorage.getItem(this.langKey) || 'fr';
  }

  clearAll(): void {
    localStorage.removeItem(this.configKey);
    localStorage.removeItem(this.resultKey);
    this.result.set(null);
  }
}