import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {map, Observable, tap} from 'rxjs';
import { SoapCalculService } from 'src/app/services/soap-calcul.service';
import {ReloadPlugsService} from "../../services/reload-plugs.service";

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

  listOfPlaces!:string[];
  listOfPlugs!:any[];
  constructor(private soapCalcul: SoapCalculService, private plugsService:ReloadPlugsService) { }
  ngOnInit(): void {
    this.soapCalcul.calculDuration(60,45.7603831,4.849664,43.3,5.4,400.0,35.5).pipe(
      map(value => this.resultat = value)
    ).subscribe();
    this.listOfPlaces=['Lyon','Paris','Marseille'];
    this.plugsService.getPlugsNearCoordinate(45.75 ,4.85, 10000).pipe(
      map(value => this.listOfPlugs.push(value))
    ).subscribe();

    // this.plugsService.getPlugsNearCoordinate(this.plugsService.convertDecimalToDMS(45.7603831),this.plugsService.convertDecimalToDMS(4.849664)).pipe(
    //   map(value => this.listOfPlugs.push(value))
    // ).subscribe()
  }


  onSubmitForm(form: NgForm) {
    console.log(form.value);

    const dist = form.value.distance;
    const vitt = form.value.vitesse;
    const auto = form.value.autonomie;
    const rech = form.value.recharge;


  }

}
