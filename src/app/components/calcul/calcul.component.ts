import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {map} from 'rxjs';
import {SoapCalculService} from 'src/app/services/soap-calcul.service';
import {ReloadPlugsService} from "../../services/reload-plugs.service";
import {MapComponent} from "../map/map.component";
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import {mark} from "@angular/compiler-cli/src/ngtsc/perf/src/clock";
@Component({
  selector: 'app-calcul',
  templateUrl: './calcul.component.html',
  styleUrls: ['./calcul.component.scss']
})
export class CalculComponent implements OnInit {


  placesSuggestions!: any[];
  placesSuggestions2!: any[];

  startCity!: string;
  endCity!: string;

  vitesseMoyenne!: number;
  lat1!: number;
  lon1!: number;
  lat2!: number;
  lon2!: number;
  autonomie!: number;
  tempsRechargeMin!: number;

  resultat!: number;

  listOfPlugs!: any[];

  @ViewChild(MapComponent) map!: MapComponent;
  constructor(private soapCalcul: SoapCalculService, private plugsService: ReloadPlugsService) {
  }

  ngOnInit(): void {
    this.soapCalcul.calculDuration(60, 45.7603831, 4.849664, 43.3, 5.4, 400.0, 35.5).pipe(
      map(value => this.resultat = value)
    ).subscribe();
    this.plugsService.getPlugsNearCoordinate(45.75, 4.85, 10000).pipe(
      map(value => this.listOfPlugs.push(value))
    ).subscribe();
  }

  onUserInputArray1($event: any) {
    this.startCity = $event.target.value;
    this.plugsService.getCities(this.startCity).subscribe(
      (data: any) => {
        this.placesSuggestions = data;
      }
    );
  }

  onUserInputArray2(event: any) {
    this.endCity = event.target.value;
    this.plugsService.getCities(this.endCity).subscribe(
      (data: any) => {
        this.placesSuggestions2 = data;
      }
    );
  }


  onSubmitForm(form: NgForm) {
    if (form.valid) {
      this.plugsService.getCityCoordinates(this.startCity).subscribe(
        (data: any) => {
          console.log('DATA: ', data)
          this.lat1 = data.split(',')[0];
          this.lon1 = data.split(',')[1];
          const marker = L.marker([this.lat1, this.lon1]).addTo(this.map.map);
          marker.bindPopup('Départ: '+this.startCity).openPopup();
        }
      );
      this.plugsService.getCityCoordinates(this.endCity).subscribe(
        (data: any) => {
          this.lat2 = data.split(',')[0];
          this.lon2 = data.split(',')[1];
          const marker = L.marker([this.lat2, this.lon2]).addTo(this.map.map);
          marker.bindPopup('Arrivée: '+this.endCity).openPopup();
          this.map.map.panTo(new L.LatLng(this.lat2, this.lon2));
          const routingControl = L.Routing.control({
            waypoints: [
              L.latLng(this.lat1, this.lon1),
              L.latLng(this.lat2, this.lon2),
            ],
            routeWhileDragging: true,
            showAlternatives: true,

          }).addTo(this.map.map)
          //I need to get the geojson from the routing control
          //and then use it to get the distance
          //and then use it to get the duration
          //and then use it to get the number of plugs needed
          routingControl.on('routesfound', (e: any) => {
            const routes = e.routes;
            const distance = routes[0].summary.totalDistance;
            const duration = routes[0].summary.totalTime;
            // const plugsNeeded = this.calculatePlugsNeeded(distance, duration);

            //this.soapCalcul.calculDuration(duration, this.lat1, this.lon1, this.lat2, this.lon2, this.autonomie, this.tempsRechargeMin).pipe(
            console.log('distance: ', distance);
            console.log('duration: ', duration);


          });

        }
      );

    }
  }
}
