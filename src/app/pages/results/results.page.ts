import { CommonModule } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import {
  IonButton, IonContent, IonFooter, IonHeader, IonIcon,
  IonLabel, IonSelect, IonSelectOption, IonTabBar,
  IonTabButton, IonToolbar, IonSpinner
} from '@ionic/angular/standalone';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AppStateService } from '../../core/app-state.service';
import { ProductService } from '../../core/product.service';
import { addIcons } from 'ionicons';
import { home, settingsOutline, barChartOutline, openOutline } from 'ionicons/icons';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule, TranslatePipe, RouterLink, RouterLinkActive,
    IonHeader, IonToolbar, IonContent, IonFooter, IonButton,
    IonSelect, IonSelectOption, IonTabBar, IonTabButton,
    IonIcon, IonLabel, IonSpinner,
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
  result      = this.state.result;

  // État du chargement
  productsLoading = this.productService.loading;
  productsError   = this.productService.error;

  // Produits filtrés selon les résultats du configurateur
  recommendedBatteries = computed(() =>
    this.productService
      .getRecommendedProducts('battery', this.result()?.recommendedBatteryAh)
      .slice(0, 3)
  );

  recommendedSolar = computed(() =>
    this.productService
      .getRecommendedProducts('solar', this.result()?.recommendedSolarW)
      .slice(0, 3)
  );

  recommendedInverters = computed(() =>
    this.productService
      .getRecommendedProducts('inverter', this.result()?.recommendedInverterW)
      .slice(0, 2)
  );

  hasProducts = computed(
    () =>
      this.recommendedBatteries().length > 0 ||
      this.recommendedSolar().length > 0 ||
      this.recommendedInverters().length > 0
  );

  constructor() {
    addIcons({ home, settingsOutline, barChartOutline, openOutline });
    this.translate.use(this.currentLang);
    this.productService.loadProducts(this.currentLang);
  }

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    this.state.saveLanguage(lang);
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
}