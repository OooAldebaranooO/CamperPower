import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonSelect,
  IonSelectOption,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AppStateService } from '../../core/app-state.service';

@Component({
  selector: 'app-results',
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
  ],
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage {
  private router = inject(Router);
  private translate = inject(TranslateService);
  private state = inject(AppStateService);

  currentLang = this.state.loadLanguage();
  result = this.state.loadResult();

  constructor() {
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