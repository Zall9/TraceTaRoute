import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { SoapCalculService } from 'src/app/services/soap-calcul.service';

@Component({
  selector: 'app-calcul',
  templateUrl: './calcul.component.html',
  styleUrls: ['./calcul.component.scss']
})
export class CalculComponent implements OnInit {

 vitesseMoyenne!: number;
 lat1!: number;
  lon1!: number;
  lat2!: number;
  lon2!: number;
  autonomie!: number;
  tempsRechargeMin!: number;

  resultat!: number;

  constructor(private soapCalcul: SoapCalculService) { }
  ngOnInit(): void {
    this.soapCalcul.calculDuration(60,45.7603831,4.849664,43.3,5.4,400.0,35.5).pipe(
      map(value => this.resultat = value)
    ).subscribe();
  }


  onSubmitForm(form: NgForm) {
    console.log(form.value);

    const dist = form.value.distance;
    const vitt = form.value.vitesse;
    const auto = form.value.autonomie;
    const rech = form.value.recharge;


  }

}
