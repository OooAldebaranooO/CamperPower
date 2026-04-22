import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonButton, IonContent, IonHeader, IonIcon,
  IonSelect, IonSelectOption, IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AppStateService } from '../../core/app-state.service';
import { addIcons } from 'ionicons';
import {
  home, homeOutline, settingsOutline, barChartOutline,
  openOutline, batteryHalfOutline, sunnyOutline, flashOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonIcon,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  private router    = inject(Router);
  private translate = inject(TranslateService);
  private state     = inject(AppStateService);

  currentLang = this.state.loadLanguage();
  result      = this.state.loadResult();

  constructor() {
    addIcons({
      home, homeOutline, settingsOutline, barChartOutline,
      openOutline, batteryHalfOutline, sunnyOutline, flashOutline,
    });
    this.translate.use(this.currentLang);
  }

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    this.state.saveLanguage(lang);
  }

  start(): void {
    this.router.navigateByUrl('/configurator');
  }

  goToResults(): void {
    this.router.navigate(['/results']);
  }
}