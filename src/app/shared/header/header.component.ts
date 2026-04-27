import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from '../../core/app-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonSelect, IonSelectOption],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private translate = inject(TranslateService);
  private state = inject(AppStateService);

  currentLang = this.state.loadLanguage();

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    this.state.saveLanguage(lang);
  }
}