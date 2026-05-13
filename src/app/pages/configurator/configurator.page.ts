import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AppStateService } from '../../core/app-state.service';
import { ApplianceInput } from '../../models/energy.model';
import { EnergyCalculatorService } from '../../services/energy-calculator.service';
import { addIcons } from 'ionicons';
import {
  home,
  homeOutline,
  settingsOutline,
  barChartOutline,
  flashOutline,
  refreshOutline,
  busOutline,
  trailSignOutline,
  carOutline,
  trashOutline,
} from 'ionicons/icons';
import { HeaderComponent } from '../../shared/header/header.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configurator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    HeaderComponent,
  ],
  templateUrl: './configurator.page.html',
  styleUrls: ['./configurator.page.scss'],
})
export class ConfiguratorPage {
  private fb         = inject(FormBuilder);
  private calculator = inject(EnergyCalculatorService);
  private router     = inject(Router);
  private translate  = inject(TranslateService);
  private state      = inject(AppStateService);

  @ViewChild(IonContent) content!: IonContent;
  @ViewChild('deviceList') deviceListRef!: ElementRef;

  currentLang  = this.state.loadLanguage();
  vehicleType  = 'camping-car';

  // ── Presets ────────────────────────────────────────────────────────────────
  // Remplis chaque tableau avec tes appareils (name, power, hoursPerDay, quantity, startupFactor)
  private vehiclePresets: Record<string, { name: string; power: number; hoursPerDay: number; quantity: number; startupFactor: number }[]> = {
    'camping-car': [
      { name: 'Eclairage', power: 10, hoursPerDay:  5, quantity: 1, startupFactor: 1 },
      { name: 'Réfrigérateur', power: 50, hoursPerDay: 9, quantity: 1, startupFactor: 2 },
      { name: 'Ordinateur', power: 50, hoursPerDay:  2, quantity: 1, startupFactor: 1 },
      { name: 'Prises USB', power: 10, hoursPerDay:  4, quantity: 1, startupFactor: 1 },
      { name: 'Chauffage / Ventilation', power: 100, hoursPerDay:  5, quantity: 1, startupFactor: 1 },
      { name: 'Pompe à eau', power: 30, hoursPerDay:  1, quantity: 1, startupFactor: 1 },
      { name: 'Télévision', power: 50, hoursPerDay:  2, quantity: 1, startupFactor: 1 },
      { name: 'Petit électroménager', power: 1200, hoursPerDay:  0.5, quantity: 1, startupFactor: 1 },
    ],
    'caravane': [
      { name: 'Eclairage', power: 10, hoursPerDay:  5, quantity: 1, startupFactor: 1 },
      { name: 'Réfrigérateur', power: 50, hoursPerDay: 9, quantity: 1, startupFactor: 2 },
      { name: 'Ordinateur', power: 50, hoursPerDay:  2, quantity: 1, startupFactor: 1 },
      { name: 'Prises USB', power: 10, hoursPerDay:  4, quantity: 1, startupFactor: 1 },
    ],
    'van': [
      { name: 'Eclairage', power: 10, hoursPerDay:  5, quantity: 1, startupFactor: 1 },
      { name: 'Ordinateur', power: 50, hoursPerDay:  2, quantity: 1, startupFactor: 1 },
      { name: 'Prises USB', power: 10, hoursPerDay:  4, quantity: 1, startupFactor: 1 },
      { name: 'Chauffage / Ventilation', power: 100, hoursPerDay:  5, quantity: 1, startupFactor: 1 },
      { name: 'Petit électroménager', power: 1200, hoursPerDay:  0.5, quantity: 1, startupFactor: 1 },
      { name: 'Glacière', power: 40, hoursPerDay:  9, quantity: 1, startupFactor: 1 },
    ],
  };

  form = this.fb.group({
    batteryVoltage:          [12,  [Validators.required, Validators.min(12)]],
    batteryAutonomyDays:     [1,   [Validators.required, Validators.min(1)]],
    batteryDepthOfDischarge: [0.8, [Validators.required, Validators.min(0.1), Validators.max(1)]],
    solarProductionHours:    [4,   [Validators.required, Validators.min(1)]],
    systemLossFactor:        [1.2, [Validators.required, Validators.min(1)]],
    appliances: this.fb.array(
      this.vehiclePresets['camping-car'].map(a =>
        this.createApplianceGroup(a.name, a.power, a.hoursPerDay, a.quantity, a.startupFactor)
      )
    ),
  });

  constructor() {
    addIcons({ home, homeOutline, settingsOutline, barChartOutline, flashOutline, refreshOutline, busOutline, trailSignOutline, carOutline, trashOutline });
    this.translate.use(this.currentLang);

    const saved = this.state.loadConfig();
    if (saved) {
      this.form.patchValue({
        batteryVoltage:          saved['batteryVoltage']          ?? 12,
        batteryAutonomyDays:     saved['batteryAutonomyDays']     ?? 1,
        batteryDepthOfDischarge: saved['batteryDepthOfDischarge'] ?? 0.8,
        solarProductionHours:    saved['solarProductionHours']    ?? 4,
        systemLossFactor:        saved['systemLossFactor']        ?? 1.2,
      });

      if (Array.isArray(saved['appliances']) && saved['appliances'].length) {
        this.appliances.clear();
        saved['appliances'].forEach((item: any) => {
          this.appliances.push(
            this.createApplianceGroup(
              item['name']          ?? '',
              Number(item['power']         ?? 0),
              Number(item['hoursPerDay']   ?? 1),
              Number(item['quantity']      ?? 1),
              Number(item['startupFactor'] ?? 1),
            )
          );
        });
      }
    }

    this.form.valueChanges.subscribe(() => {
      this.state.saveConfig(this.form.getRawValue());
    });
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  get appliances(): FormArray<FormGroup> {
    return this.form.get('appliances') as FormArray<FormGroup>;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  createApplianceGroup(
    name          = '',
    power         = 0,
    hoursPerDay   = 1,
    quantity      = 1,
    startupFactor = 1,
  ): FormGroup {
    return this.fb.group({
      name:          [name,          [Validators.required]],
      power:         [power,         [Validators.required, Validators.min(1)]],
      hoursPerDay:   [hoursPerDay,   [Validators.required, Validators.min(0.1)]],
      quantity:      [quantity,      [Validators.required, Validators.min(1)]],
      startupFactor: [startupFactor, [Validators.required, Validators.min(1)]],
    });
  }

  totalItemWh(index: number): number {
    const group = this.appliances.at(index);
    return Math.round(
      Number(group.get('power')?.value       ?? 0) *
      Number(group.get('hoursPerDay')?.value  ?? 0) *
      Number(group.get('quantity')?.value     ?? 0)
    );
  }

  // ── Vehicle segment ────────────────────────────────────────────────────────

  onVehicleTypeChange(event: any): void {
    this.vehicleType = event.detail.value;
    this.loadPreset(this.vehicleType);
  }

  loadPreset(type: string): void {
    const preset = this.vehiclePresets[type] ?? [];
    this.appliances.clear();
    preset.forEach(a =>
      this.appliances.push(
        this.createApplianceGroup(a.name, a.power, a.hoursPerDay, a.quantity, a.startupFactor)
      )
    );
    this.state.saveConfig(this.form.getRawValue());
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  addAppliance(): void {
    this.appliances.push(this.createApplianceGroup());
    this.state.saveConfig(this.form.getRawValue());

    setTimeout(() => {
      const list     = this.deviceListRef.nativeElement;
      const lastCard = list.querySelector('.device-card:last-child');
      if (lastCard) {
        this.content.scrollToPoint(0, lastCard.offsetTop, 400);
      }
    }, 100);
  }

  removeAppliance(index: number): void {
    if (this.appliances.length > 1) {
      this.appliances.removeAt(index);
      this.state.saveConfig(this.form.getRawValue());
    }
  }

  calculate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const appliances: ApplianceInput[] = (raw.appliances ?? []).map((item) => ({
      name:          item['name']          ?? '',
      power:         Number(item['power']         ?? 0),
      hoursPerDay:   Number(item['hoursPerDay']   ?? 0),
      quantity:      Number(item['quantity']      ?? 1),
      startupFactor: Number(item['startupFactor'] ?? 1),
    }));

    const result = this.calculator.calculate(
      appliances,
      Number(raw.batteryVoltage),
      Number(raw.batteryAutonomyDays),
      Number(raw.batteryDepthOfDischarge),
      Number(raw.solarProductionHours),
      Number(raw.systemLossFactor),
    );

    this.state.saveConfig(this.form.getRawValue());
    this.state.saveResult(result);
    this.router.navigateByUrl('/results');
  }

  resetForm(): void {
    this.state.clearAll();
    this.vehicleType = 'camping-car';
    this.form.reset({
      batteryVoltage:          12,
      batteryAutonomyDays:     1,
      batteryDepthOfDischarge: 0.8,
      solarProductionHours:    4,
      systemLossFactor:        1.2,
    });
    this.loadPreset('camping-car');
  }

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    this.state.saveLanguage(lang);
  }

  goHome(): void {
    this.router.navigateByUrl('/home');
  }
}