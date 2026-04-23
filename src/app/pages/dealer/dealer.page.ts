import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonIcon, IonToolbar, IonSelect, IonSelectOption, } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AppStateService } from '../../core/app-state.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import { arrowBackOutline, navigateOutline, locationOutline, homeOutline, searchOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

const MY_MAPS_BASE = 'https://www.google.com/maps/d/u/1/embed?mid=10LQZ4Qxrww06HUz9g2qBgnnz5fL79mCb&ehbc=2E312F';

@Component({
  selector: 'app-dealer',
  standalone: true,
  imports: [
    CommonModule, TranslatePipe, FormsModule,
    IonHeader, IonToolbar, IonContent, IonButton,
    IonIcon, IonSelect, IonSelectOption,
  ],
  templateUrl: './dealer.page.html',
  styleUrls: ['./dealer.page.scss'],
})
export class DealerPage {
  private router    = inject(Router);
  private translate = inject(TranslateService);
  private state     = inject(AppStateService);
  private sanitizer = inject(DomSanitizer);

  currentLang = this.state.loadLanguage();
  locating    = signal(false);
  mapUrl      = signal<SafeResourceUrl>(
    this.sanitizer.bypassSecurityTrustResourceUrl(MY_MAPS_BASE)
  );

  constructor() {
    addIcons({ arrowBackOutline, navigateOutline, locationOutline, homeOutline, searchOutline });
    this.translate.use(this.currentLang);
  }

  async useMyLocation(): Promise<void> {
    this.locating.set(true);

    try {
      // Demande la permission sur mobile
      if (Capacitor.isNativePlatform()) {
        const permission = await Geolocation.requestPermissions();
        if (permission.location !== 'granted') {
          this.locating.set(false);
          return;
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const url = `https://www.google.com/maps/d/u/1/embed?mid=10LQZ4Qxrww06HUz9g2qBgnnz5fL79mCb&ehbc=2E312F&ll=${lat},${lng}&z=10`;
      this.mapUrl.set(
        this.sanitizer.bypassSecurityTrustResourceUrl(url)
      );

    } catch (err) {
      console.error('[Geolocation]', err);
    } finally {
      this.locating.set(false);
    }
  }

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    this.state.saveLanguage(lang);
  }

  goBack(): void {
    this.router.navigateByUrl('/results');
  }

  goHome(): void {
    this.router.navigateByUrl('/home');
  }

  // Propriété
  searchQuery = '';

  // Méthode — centre la carte sur la ville saisie via l'API Nominatim
  searchByQuery(): void {
    if (!this.searchQuery.trim()) return;

    const query = encodeURIComponent(this.searchQuery);
    fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=fr,be,nl,es,it,de`)
      .then(r => r.json())
      .then((results: any[]) => {
        if (!results?.length) return;
        const lat = parseFloat(results[0].lat);
        const lng = parseFloat(results[0].lon);
        const url = `https://www.google.com/maps/d/u/1/embed?mid=10LQZ4Qxrww06HUz9g2qBgnnz5fL79mCb&ehbc=2E312F&ll=${lat},${lng}&z=10`;
        this.mapUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
      });
  }
}