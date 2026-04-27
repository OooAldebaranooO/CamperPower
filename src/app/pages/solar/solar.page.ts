import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-solar',
  templateUrl: './solar.page.html',
  styleUrls: ['./solar.page.scss'],
  standalone: true,
  imports: [IonContent, TranslatePipe, CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class SolarPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
