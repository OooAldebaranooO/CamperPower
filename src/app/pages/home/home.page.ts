import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonContent, IonButton, TranslatePipe],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  private router = inject(Router);

  start(): void {
    this.router.navigateByUrl('/configurator');
  }

  goToResults(): void {
    this.router.navigateByUrl('/results');
  }
}