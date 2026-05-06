import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.page.html',
  styleUrls: ['./converter.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class ConverterPage implements OnInit {

  constructor(
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  getHtml(key: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.translate.instant(key));
  }

}
