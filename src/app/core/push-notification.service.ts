import { Injectable } from '@angular/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {

  async requestPermission(): Promise<string | null> {
    try {
      await FirebaseMessaging.requestPermissions();
      const { token } = await FirebaseMessaging.getToken();
      console.log('Token Android:', token);
      return token;
    } catch (e) {
      console.error('Erreur permission:', e);
      return null;
    }
  }

  listenToMessages() {
    FirebaseMessaging.addListener('notificationReceived', (notification) => {
      console.log('Notification reçue:', notification);
    });
  }
}