import { Component, inject } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { settingsOutline, homeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [IonButton, IonIcon, TranslatePipe],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private router = inject(Router);

  constructor() {
    addIcons({ settingsOutline, homeOutline });
  }

  start(): void {
    this.router.navigateByUrl('/configurator');
  }

  goHome(): void {
    this.router.navigateByUrl('/home');
  }
}