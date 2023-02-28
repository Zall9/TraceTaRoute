import {Component, Input, OnInit, Output} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() lat1!: number;
  @Input() lat2!: number;
  @Input() lon1!: number;
  @Input() lon2!: number;
  @Output() map!: L.Map;

  constructor() {
  }

  ngOnInit() {
    this.map=L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(
      this.map
    );

    L.marker([this.lat1, this.lon1])
      .addTo(this.map)
      .bindPopup('Départ')
      .openPopup();

    L.marker([this.lat2, this.lon2])
      .addTo(this.map)
      .bindPopup('Arrivée')
      .openPopup();


  }

}
