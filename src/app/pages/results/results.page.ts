import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTabBar,
  IonTabButton,
  IonToolbar,
} from '@ionic/angular/standalone';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AppStateService } from '../../core/app-state.service';
import { addIcons } from 'ionicons';
import { home, settingsOutline, barChartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    RouterLink,
    RouterLinkActive,
    IonHeader,
    IonToolbar,
    IonContent,
    IonFooter,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  ],
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage {
  private router = inject(Router);
  private translate = inject(TranslateService);
  private state = inject(AppStateService);

  currentLang = this.state.loadLanguage();
  result = this.state.result;

  constructor() {
    addIcons({ home, settingsOutline, barChartOutline });
    this.translate.use(this.currentLang);
  }

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    this.state.saveLanguage(lang);
  }

  backToConfig(): void {
    this.router.navigateByUrl('/configurator');
  }

  goHome(): void {
    this.router.navigateByUrl('/home');
  }
}