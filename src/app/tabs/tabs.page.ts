import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, settingsOutline, barChartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IonIcon],
  template: `
    <nav class="tab-bar">
      <a routerLink="/home" routerLinkActive="active" class="tab-btn">
        <ion-icon name="home"></ion-icon>
        <span>Accueil</span>
      </a>
      <a routerLink="/configurator" routerLinkActive="active" class="tab-btn">
        <ion-icon name="settings-outline"></ion-icon>
        <span>Configurer</span>
      </a>
      <a routerLink="/results" routerLinkActive="active" class="tab-btn">
        <ion-icon name="bar-chart-outline"></ion-icon>
        <span>Résultats</span>
      </a>
    </nav>
  `,
  styles: [`
    .tab-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #fff;
      border-top: 1px solid #e0e0e0;
      padding: 8px 0 12px;
      z-index: 1000;
    }
    .tab-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: #888;
      text-decoration: none;
      font-size: 11px;
    }
    .tab-btn ion-icon {
      font-size: 22px;
    }
    .tab-btn.active {
      color: #e3000f;
    }
  `],
})
export class TabsPage {
  constructor() {
    addIcons({ home, settingsOutline, barChartOutline });
  }
}