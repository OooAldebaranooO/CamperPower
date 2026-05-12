importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAaF0wJwPf8MnWhWIbUPtWbTaSFVs-HjSk",
  authDomain: "vechline-configurator.firebaseapp.com",
  projectId: "vechline-configurator",
  storageBucket: "vechline-configurator.firebasestorage.app",
  messagingSenderId: "1066915093085",
  appId: "1:1066915093085:web:87c8dc4f80f47c51938bb4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/assets/icon/favicon.png'
  });
});