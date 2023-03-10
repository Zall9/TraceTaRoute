import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, pipe, tap} from "rxjs";


export const plugServiceURL = "https://odre.opendatasoft.com/api/records/1.0/search/?dataset=bornes-irve&q=&"

export const CitiesURL = "https://nominatim.openstreetmap.org/"
@Injectable({
  providedIn: 'root'
})
export class ReloadPlugsService {
  citiesSuggestions!: any[];

  options = {
    refine: "&q=&refine.region="
  }

  constructor(private http: HttpClient) {
  }

  convertDecimalToDMS(decimalDegrees: number): string {
    const degrees = Math.floor(decimalDegrees);
    const minutes = Math.floor((decimalDegrees - degrees) * 60);
    const seconds = ((decimalDegrees - degrees - minutes / 60) * 3600).toFixed(2);
    return `${degrees}°${minutes}'${seconds}"`;
  }
  getPlugsNearCoordinate(x: number, y: number, distance: number): Observable<Object> {
    return this.http.get(plugServiceURL + "&geofilter.distance=" + x + "%2C" + y + "%2C" + distance).pipe(
      tap((data) => console.log(data))
    )
  }
  getPlugsNearMyRoute(coordinates:string):Observable<Object>{
    coordinates.replace(",","%2C")
    return this.http.get(plugServiceURL+"&geofilter.polygon="+coordinates).pipe(
      tap((data) => console.log(data))
    )
  }
  getCities(name:string):Observable<any>{
    return this.http.get<any[]>(CitiesURL+"search?q="+name+"&format=json").pipe(
      map(value=> {
        let cities:string[]=[];
        for(let i=0;i<value.length;i++){
          cities.push(value[i].display_name)
        }
        return cities;
      })
    )
  }

  getCityCoordinates(name:string):Observable<any>{
    return this.http.get<any[]>(CitiesURL+"search?q="+name+"&format=json").pipe(
      map(value=> {
        return value[0].lat + "," + value[0].lon;
      })
    )
  }

  getPlugsNearCoordinateSecure(x: number, y: number, distance: number): Observable<any> {
    return this.http.get(plugServiceURL + "&geofilter.distance=" + x + "%2C" + y + "%2C" + distance).pipe(
      map((data: any) => {
        let name = data["records"][0]?.fields.ad_station;
        let latitude = data["records"][0].geometry.coordinates[1];
        let longitude = data["records"][0].geometry.coordinates[0];
        let observations = data["records"][0]?.fields.observations;

        if (latitude === undefined || longitude === undefined || observations === undefined || name === undefined) {
          throw new Error("Latitude ou longitude indéfinie.");
        }

        return {name, latitude, longitude, observations};
      })
    );
  }


  getGeoCoding(cityName: string): Observable<{ lat: number, lon: number }> {
    const uri = `${CitiesURL}/search?q=${cityName}&format=json`;

    return this.http.get<any>(uri).pipe(
      map(value => {
        return  { lat: value[0].lat, lon: value[0].lon };
      })
    );
  }
  getBorne(lat: number, lon: number, radius: number): Observable<any[]> {
    const uri = plugServiceURL + `geofilter.distance=${lat}%2C${lon}%2C${radius}`;

    return this.http.get<any>(uri).pipe(
      map(value => value.records[0])
    );
  }
}
