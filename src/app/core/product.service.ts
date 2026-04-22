import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, of } from 'rxjs';

export interface Product {
  id: string;
  sku: string;
  name: Record<string, string>;
  description: Record<string, string>;
  imageUrl: string | null;
  price: number | null;
  currency: string;
  category: 'battery' | 'solar' | 'inverter' | 'accessory';
  specs: {
    capacityAh?: number;
    powerW?: number;
  };
  productUrl: string;
  isNew: boolean;
}

const API_ENDPOINT = 'https://www.tools-cmc-ea.fr/app_vechline/produits.php';
const CACHE_KEY    = 'vp_products_v6';
const CACHE_TTL    = 3_600_000; // 1h

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'bat-100', sku: 'VEC-BAT-100',
    name: { fr: 'Batterie AGM 100Ah', en: 'AGM Battery 100Ah', nl: 'AGM Accu 100Ah', es: 'Batería AGM 100Ah', it: 'Batteria AGM 100Ah' },
    description: { fr: 'Batterie AGM deep cycle pour camping-car' },
    imageUrl: null, price: 189, currency: 'EUR',
    category: 'battery', specs: { capacityAh: 100 },
    productUrl: '#',
    isNew: false,
  },
  {
    id: 'sol-150', sku: 'VEC-SOL-150',
    name: { fr: 'Panneau solaire 150W', en: 'Solar panel 150W', nl: 'Zonnepaneel 150W', es: 'Panel solar 150W', it: 'Pannello solare 150W' },
    description: { fr: 'Panneau monocristallin 150W' },
    imageUrl: null, price: 249, currency: 'EUR',
    category: 'solar', specs: { powerW: 150 },
    productUrl: '#',
    isNew: false,
  },
  {
    id: 'inv-1000', sku: 'VEC-INV-1000',
    name: { fr: 'Onduleur 1000W', en: 'Inverter 1000W', nl: 'Omvormer 1000W', es: 'Inversor 1000W', it: 'Inverter 1000W' },
    description: { fr: 'Onduleur pur sinus 1000W' },
    imageUrl: null, price: 299, currency: 'EUR',
    category: 'inverter', specs: { powerW: 1000 },
    productUrl: '#',
    isNew: false,
  },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  products = signal<Product[]>([]);
  loading  = signal(false);
  error    = signal<string | null>(null);

    loadProducts(lang = 'fr'): void {
    const cached = this.readCache(lang);
    if (cached) {
      this.products.set(cached);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<{ data: any[] }>(API_ENDPOINT, { params: { lang } })
      .pipe(
        tap((res) => {
          const mapped = (res.data ?? []).map((r): Product => ({
            id:          r.sku,
            sku:         r.sku,
            name:        { [lang]: r.name ?? r.sku },
            description: { [lang]: r.description ?? '' },
            imageUrl:    r.image_url ?? null,
            price:       r.price ? parseFloat(r.price) : null,
            currency:    'EUR',
            category:    r.category,
            specs: {
              capacityAh: r.capacity_ah !== null && r.capacity_ah !== undefined && r.capacity_ah !== ''
                ? parseFloat(r.capacity_ah)
                : undefined,
              powerW: r.power_w !== null && r.power_w !== undefined && r.power_w !== ''
                ? parseFloat(r.power_w)
                : undefined,
            },
            productUrl: '#',
            isNew: r.nouveaute_print === '1' || r.nouveaute_print === 1,
          }));
          this.products.set(mapped);
          this.writeCache(lang, mapped);
          this.loading.set(false);
        }),
        catchError((err) => {
          console.error('[ProductService]', err);
          this.error.set('Produits temporairement indisponibles');
          this.products.set(FALLBACK_PRODUCTS);
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  getRecommendedProducts(
    category: Product['category'],
    minValue?: number
  ): Product[] {
    return this.products().filter((p) => {
      if (p.category !== category) return false;
      if (!minValue) return true;
      if (category === 'battery')  return (p.specs.capacityAh ?? 0) >= minValue;
      if (category === 'solar')    return (p.specs.powerW    ?? 0) >= minValue;
      if (category === 'inverter') return (p.specs.powerW    ?? 0) >= minValue;
      return true;
    });
  }

  private readCache(lang: string): Product[] | null {
    try {
      const raw = localStorage.getItem(`${CACHE_KEY}_${lang}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { data: Product[]; ts: number };
      return Date.now() - parsed.ts < CACHE_TTL ? parsed.data : null;
    } catch { return null; }
  }

  private writeCache(lang: string, data: Product[]): void {
    try {
      localStorage.setItem(
        `${CACHE_KEY}_${lang}`,
        JSON.stringify({ data, ts: Date.now() })
      );
    } catch { }
  }

  invalidateCache(lang: string): void {
  localStorage.removeItem(`${CACHE_KEY}_${lang}`);
}
}