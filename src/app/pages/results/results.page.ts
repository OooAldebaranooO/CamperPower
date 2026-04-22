import { CommonModule } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import {
  IonButton, IonContent, IonHeader, IonIcon,
  IonSelect, IonSelectOption, IonToolbar, IonSpinner,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AppStateService } from '../../core/app-state.service';
import { ProductService, Product } from '../../core/product.service';
import { addIcons } from 'ionicons';
import {
  home, homeOutline, settingsOutline, barChartOutline,
  openOutline, batteryHalfOutline, sunnyOutline, flashOutline,
} from 'ionicons/icons';

export interface SolarOption {
  product: Product;
  quantity: number;       // nombre de panneaux nécessaires
  totalW: number;         // puissance totale couverte
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule, TranslatePipe,
    IonButton, IonContent, IonHeader, IonIcon,
    IonSelect, IonSelectOption, IonToolbar, IonSpinner,
  ],
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage {
  private router         = inject(Router);
  private translate      = inject(TranslateService);
  private state          = inject(AppStateService);
  private productService = inject(ProductService);

  currentLang = this.state.loadLanguage();
  result      = computed(() => this.state.result());

  productsLoading = this.productService.loading;
  productsError   = this.productService.error;

  recommendedBatteries = computed(() =>
    this.productService
      .getRecommendedProducts('battery', this.result()?.recommendedBatteryAh)
      .slice(0, 10)
  );

  // Panneaux solaires avec cumul
  recommendedSolar = computed((): SolarOption[] => {
    const minW = this.result()?.recommendedSolarW ?? 0;

    // Tous les panneaux avec une puissance définie, triés du plus puissant au moins puissant
    const allSolar = this.productService.products()
      .filter(p => p.category === 'solar' && (p.specs.powerW ?? 0) > 0)
      .sort((a, b) => (b.specs.powerW ?? 0) - (a.specs.powerW ?? 0));

    return allSolar
      .map((product): SolarOption => {
        const pw = product.specs.powerW ?? 1;
        const quantity = Math.ceil(minW / pw); // nombre de panneaux nécessaires
        return {
          product,
          quantity,
          totalW: quantity * pw,
        };
      })
      // On garde uniquement les options raisonnables (max 10 panneaux)
      .filter(opt => opt.quantity <= 10)
      // Trie par nombre de panneaux croissant, puis par puissance unitaire décroissante
      .sort((a, b) => a.quantity - b.quantity || (b.product.specs.powerW ?? 0) - (a.product.specs.powerW ?? 0))
      .slice(0, 10);
  });

  recommendedInverters = computed(() =>
    this.productService
      .getRecommendedProducts('inverter', this.result()?.recommendedInverterW)
      .slice(0, 10)
  );

  hasProducts = computed(
    () =>
      this.recommendedBatteries().length > 0 ||
      this.recommendedSolar().length > 0 ||
      this.recommendedInverters().length > 0
  );

  constructor() {
    this.state.loadResult();

    addIcons({
      home, homeOutline, settingsOutline, barChartOutline,
      openOutline, batteryHalfOutline, sunnyOutline, flashOutline,
    });
    this.translate.use(this.currentLang);
    this.productService.loadProducts(this.currentLang);
  }

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    this.state.saveLanguage(lang);
    this.productService.invalidateCache(lang);
    this.productService.loadProducts(lang);
  }

  backToConfig(): void { this.router.navigateByUrl('/configurator'); }
  goHome(): void        { this.router.navigateByUrl('/home'); }

  openProduct(url: string): void {
    window.open(url, '_blank', 'noopener');
  }

  getLocalizedName(names: Record<string, string>): string {
    return names[this.currentLang] ?? names['fr'] ?? Object.values(names)[0] ?? '';
  }

  formatPrice(price: number | null): string {
    if (price === null) return '';
    return new Intl.NumberFormat(this.currentLang, {
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
    }).format(price);
  }

  hasScroll(count: number): boolean {
    return count > 2;
  }
}