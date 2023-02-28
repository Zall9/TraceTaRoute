import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, pipe, tap} from "rxjs";



export const plugServiceURL="https://odre.opendatasoft.com/api/records/1.0/search/?dataset=bornes-irve"
@Injectable({
  providedIn: 'root'
})
export class ReloadPlugsService {
  options={
    refine:"&q=&refine.region="
    }
    regions={
      "Auvergne-Rhône-Alpes": "Auvergne-Rh%C3%B4ne-Alpes",
      "Occitanie": "Occitanie",
      "PACA":"Provence-Alpes-C%C3%B4te+d%27Azur",
      "Nouvelle-Aquitaine":"Nouvelle-Aquitaine",
      "Normandie":"Normandie",
      "Bourgogne-Franche-Comté":"Bourgogne-Franche-Comt%C3%A9",
      "Centre-Val de Loire":"Centre-Val+de+Loire",
      "Ile-de-France":"Ile-de-France",
      "Corse":"Corse",
      "Grand-Est":"Grand-Est",
    }
    departements={
    "Paris":"Paris",
      "Nord":"Nord",
      "Haute Savoie":"Haute+Savoie",

    "Loire-Atlantique":"Loire-Atlantique",
      "Orne":"Orne",
      "Vendée":"Vend%C3%A9e",
      "Deux-Sèvres":"Deux-S%C3%A8vres",
      "Eure-et-Loir":"Eure-et-Loir",
      "Doubs":"Doubs",
      "Haute-Saone":"Haute-Sa%C3%B4ne",
      "Gironde":"Gironde",
      "Cher":"Cher",
      "Côte-d'Or":"C%C3%B4te-d%27Or",
      "Charente-Maritime":"Charente-Maritime",
      "Sarthe":"Sarthe",
      "Calvados":"Calvados",
      "Dordogne":"Dordogne",
      "Jura":"Jura",
      "Eure":"Eure",
      "Maine-et-Loire":"Maine-et-Loire",
      "Manche":"Manche",
      "Saone-et-Loire":"Sa%C3%B4ne-et-Loire",

    }



  constructor(private http: HttpClient) { }
  convertDecimalToDMS(decimalDegrees: number): string {
    const degrees = Math.floor(decimalDegrees);
    const minutes = Math.floor((decimalDegrees - degrees) * 60);
    const seconds = ((decimalDegrees - degrees - minutes / 60) * 3600).toFixed(2);
    return `${degrees}°${minutes}'${seconds}"`;
  }

  getPlugsNearCoordinate(x:number,y:number,distance:number):Observable<Object>{
    return this.http.get(plugServiceURL+"&geofilter.distance="+x+"%2C"+y+"%2C"+distance).pipe(
      tap((data)=>console.log(data))
    )
  }

}
