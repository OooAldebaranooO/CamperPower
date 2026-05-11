import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { TranslatePipe } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-battery',
  templateUrl: './battery.page.html',
  styleUrls: ['./battery.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, TranslatePipe, FormsModule, HeaderComponent, FooterComponent]
})
export class BatteryPage implements OnInit {

  constructor(
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  getHtml(key: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.translate.instant(key));
  }
}