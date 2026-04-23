import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

alert('main.ts chargé !');

bootstrapApplication(AppComponent, appConfig).catch((err) => {
  alert('Erreur bootstrap: ' + err.message);
});