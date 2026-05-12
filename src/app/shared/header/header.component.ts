import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonSelect, IonSelectOption, IonIcon, IonButton } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from '../../core/app-state.service';
import { PushNotificationService } from '../../core/push-notification.service';
import { addIcons } from 'ionicons';
import { settingsOutline, homeOutline, notificationsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonSelect, IonSelectOption, IonIcon, IonButton],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private translate = inject(TranslateService);
  private state = inject(AppStateService);

  currentLang = this.state.loadLanguage();

  constructor(private pushService: PushNotificationService) {
    addIcons({ settingsOutline, homeOutline, notificationsOutline });
  }

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    this.state.saveLanguage(lang);
  }

  async enableNotifications() {
    const token = await this.pushService.requestPermission();
    if (token) {
      console.log('Token enregistré:', token);
    }
  }
}