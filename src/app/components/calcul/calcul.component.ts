import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {catchError, filter, map, Observable, repeatWhen, take, tap, zip} from 'rxjs';
import {SoapCalculService} from 'src/app/services/soap-calcul.service';
import {ReloadPlugsService} from "../../services/reload-plugs.service";
import {MapComponent} from "../map/map.component";
import * as L from 'leaflet';
import 'leaflet-routing-machine';

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

  lengthCoords!: number;
  latBornes!: number;
  lonBornes!: number;

  coordinates!: any[];
  CurrentBorne!: any[];
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
    $event.preventDefault();
    this.startCity = $event.target.value;
    this.plugsService.getCities(this.startCity).subscribe(
      (data: any) => {
        this.placesSuggestions = data;
      }
    );
  }

  onUserInputArray2(event: any) {
    event.preventDefault();
    this.endCity = event.target.value;
    this.plugsService.getCities(this.endCity).subscribe(
      (data: any) => {
        this.placesSuggestions2 = data;
      }
    );
  }


  onSubmitForm(form: { valid: any; }) {
    if (form.valid) {
      zip(
        this.plugsService.getGeoCoding(this.startCity),
        this.plugsService.getGeoCoding(this.endCity)
      ).pipe(
        tap(value => {
          const start = value[0];
          const dest = value[1];

          const waypoint1 = new L.LatLng(start.lat, start.lon);
          const waypoint2 = new L.LatLng(dest.lat, dest.lon);

          this.firstTraceRoute([waypoint1, waypoint2]);
        })
      ).subscribe();

    } else {
      console.log('Formulaire invalide');
    }
  };

  calculIndexArray(distanceKm: number, autonomy: number, lengthCoords: number) {
    if (autonomy < distanceKm) {
      const nbReloads = distanceKm / autonomy;
      let index = (autonomy * lengthCoords) / distanceKm;
      index = index - 400;
      if (index < 0)
        index = 0;
      index = Math.floor(index);

      // Tableau index
      let arrayIndex: any = [];
      for (let i = 1; i <= nbReloads + 1; i++) {
        arrayIndex.push(index * i);
      }
      return arrayIndex;
    }
    return null;
  }

  private firstTraceRoute(waypoints: L.LatLng[]) {
    const routing = L.Routing.control({
      waypoints: waypoints
    }).addTo(this.map.map);

    routing.on('routesfound', (e) => {
      const distanceKm = e.routes[0].summary.totalDistance / 1000;
      const coords = e.routes[0].coordinates;
      const autonomyKm = 100;

      // we calcul when we need electric power
      let index = this.calculIndexArray(distanceKm, autonomyKm, coords.length);

      // if we need it on the road
      if (index != null) {
        const observables: Observable<any>[] = [];

        // for each, we want to find the nearest charging point
        index.forEach((p: number) => {
          if (coords[p]) {
            // we add all the query in an array to send them at the same time
            observables.push(this.plugsService.getBorne(coords[p].lat, coords[p].lng, 100000));
          }
        });

        // send all the query
        zip(...observables).pipe(
          tap(value => {
            // we create a new route form start to dest passing through charging point
            const newWaypoints: any[] = [];
            newWaypoints.push(waypoints[0]);

            value.forEach(v => {
              newWaypoints.push(new L.LatLng(v.fields.ylatitude, v.fields.xlongitude))
            });

            newWaypoints.push(waypoints[1]);

            // trace new route and delete old route
            this.secondTraceRoute(newWaypoints, routing);
          })
        ).subscribe();
      }
    });
  }

  private secondTraceRoute(waypoints: L.LatLng[], routeToRemove: any) {
    // trace new route
    const routing = L.Routing.control({
      waypoints: waypoints
    }).addTo(this.map.map);

    // delete old route
    this.map.map.removeControl(routeToRemove);

    routing.on('routesfound', (e) => {
      const distanceKm = e.routes[0].summary.totalDistance / 1000;

      console.log('distanceKm : ' + distanceKm);
    })
  }

}
