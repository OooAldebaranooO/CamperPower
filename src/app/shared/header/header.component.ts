import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonSelect, IonSelectOption, IonIcon, IonButton } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from '../../core/app-state.service';
import { addIcons } from 'ionicons';
import { settingsOutline, homeOutline, notificationsOutline } from 'ionicons/icons';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

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

  constructor() {
    addIcons({ settingsOutline, homeOutline, notificationsOutline });
    this.listenToMessages();
  }

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    this.state.saveLanguage(lang);
  }

  async enableNotifications() {
    try {
      alert('Début enableNotifications');
      await FirebaseMessaging.requestPermissions();
      alert('Permissions OK');
      const { token } = await FirebaseMessaging.getToken();
      alert('Token: ' + token);

      const response = await fetch('https://www.tools-cmc-ea.fr/app_vechline/save_token.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, platform: 'android' })
      });

      const result = await response.json();
      alert('Serveur: ' + JSON.stringify(result));

    } catch (e) {
      alert('Erreur: ' + JSON.stringify(e));
    }
  }

  listenToMessages() {
    FirebaseMessaging.addListener('notificationReceived', (notification) => {
      console.log('Notification reçue:', notification);
    });

    FirebaseMessaging.addListener('notificationActionPerformed', (action) => {
      console.log('Action notification:', action);
    });
  }
}