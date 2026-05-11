import { CommonModule } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonIcon, IonSelect, IonSelectOption, IonToolbar, IonSpinner } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppStateService } from '../../core/app-state.service';
import { ProductService, Product } from '../../core/product.service';
import { addIcons } from 'ionicons';
import { home, homeOutline, settingsOutline, barChartOutline, openOutline, batteryHalfOutline, sunnyOutline, flashOutline, locationOutline, createOutline, mailOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

export interface SolarOption {
  product: Product;
  quantity: number;
  totalW: number;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule, TranslatePipe,
    IonButton, IonContent, IonHeader, IonIcon,
    IonSelect, IonSelectOption, IonToolbar, IonSpinner,
    FormsModule,
  ],
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage {
  private router         = inject(Router);
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

  recommendedSolar = computed((): SolarOption[] => {
    const minW = this.result()?.recommendedSolarW ?? 0;

    const allSolar = this.productService.products()
      .filter(p => p.category === 'solar' && (p.specs.powerW ?? 0) > 0)
      .sort((a, b) => (b.specs.powerW ?? 0) - (a.specs.powerW ?? 0));

    return allSolar
      .map((product): SolarOption => {
        const pw = product.specs.powerW ?? 1;
        const quantity = Math.ceil(minW / pw);
        return { product, quantity, totalW: quantity * pw };
      })
      .filter(opt => opt.quantity <= 10)
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

  shareEmail: string = '';
  sendingEmail: boolean = false;
  emailSent: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {
    this.state.loadResult();

    addIcons({ home, homeOutline, settingsOutline, barChartOutline, openOutline, batteryHalfOutline, sunnyOutline, flashOutline, locationOutline, createOutline, mailOutline });
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

  goToDealer(): void {
    this.router.navigateByUrl('/dealer');
  }

  getHtml(key: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.translate.instant(key));
  }

  async sendResultByEmail() {
    if (!this.shareEmail || !this.result()) return;

    this.sendingEmail = true;
    const r = this.result()!;

    const batteriesList = this.recommendedBatteries()
      .map(p => `- ${this.getLocalizedName(p.name)} (Réf. ${p.sku})${p.price ? ' - ' + this.formatPrice(p.price) : ''}`)
      .join('\n');

    const solarList = this.recommendedSolar()
      .map(opt => `- ${this.getLocalizedName(opt.product.name)} (Réf. ${opt.product.sku})${opt.quantity > 1 ? ' x' + opt.quantity + (opt.product.price ? ' - ' + this.formatPrice(opt.product.price * opt.quantity) : '') : (opt.product.price ? ' - ' + this.formatPrice(opt.product.price) : '')}`)
      .join('\n');

    const inverterList = this.recommendedInverters()
      .map(p => `- ${this.getLocalizedName(p.name)} (Réf. ${p.sku})${p.price ? ' - ' + this.formatPrice(p.price) : ''}`)
      .join('\n');

    try {
      await emailjs.send(
        'service_cap6p8u',
        'template_5weikls',
        {
          to_email: this.shareEmail,
          consumption: `${r.totalWhPerDay} Wh/jour`,
          battery: `${r.recommendedBatteryAh} Ah`,
          solar: `${r.recommendedSolarW} W`,
          inverter: `${r.recommendedInverterW} W`,
          batteries_list: batteriesList || 'Aucun produit trouvé',
          solar_list: solarList || 'Aucun produit trouvé',
          inverters_list: inverterList || 'Aucun produit trouvé',
        },
        'aHDOazn4W-S4RAEIo'
      );
      this.emailSent = true;
      this.shareEmail = '';

      setTimeout(() => {
        this.emailSent = false;
      }, 3000);

    } catch (e) {
      console.error('Erreur envoi email', e);
    } finally {
      this.sendingEmail = false;
    }
  }
}