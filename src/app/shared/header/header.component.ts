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
      // Demande la permission native Android d'abord
      const { receive } = await FirebaseMessaging.checkPermissions();
      console.log('Permission actuelle:', receive);
      
      if (receive === 'denied') {
        alert('Notifications bloquées. Activez-les dans les paramètres Android.');
        return;
      }

      const result = await FirebaseMessaging.requestPermissions();
      console.log('Résultat permission:', result);

      const { token } = await FirebaseMessaging.getToken();
      console.log('Token:', token);
      window.open(`mailto:johan.vaucheforot@gmail.com?subject=FCM Token&body=${token}`);
    } catch (e) {
      console.error('Erreur:', e);
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