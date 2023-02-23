import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { SoapCalculService } from './services/soap-calcul.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'projet-info-802';
}
