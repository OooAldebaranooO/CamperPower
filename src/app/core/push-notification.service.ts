import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAaF0wJwPf8MnWhWIbUPtWbTaSFVs-HjSk",
  authDomain: "vechline-configurator.firebaseapp.com",
  projectId: "vechline-configurator",
  storageBucket: "vechline-configurator.firebasestorage.app",
  messagingSenderId: "1066915093085",
  appId: "1:1066915093085:web:87c8dc4f80f47c51938bb4"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

@Injectable({ providedIn: 'root' })
export class PushNotificationService {

  async requestPermission(): Promise<string | null> {
    try {
      const token = await getToken(messaging, {
        vapidKey: 'BA4QhsC1HA7kQfsVBX8Ii9qSmx7U71vUPO8dbs4lqmFt6sXVHh4ODD41kAQ7mFxzO6SwL-tc3VvrddQyjj4v7go'
      });
      console.log('Token FCM:', token);
      return token;
    } catch (e) {
      console.error('Erreur permission:', e);
      return null;
    }
  }

  listenToMessages() {
    onMessage(messaging, (payload) => {
      console.log('Notification reçue:', payload);
    });
  }
}