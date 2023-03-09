import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoapCalculService {

  private uri = 'https://backend-ttr-soap.vercel.app/';
  private options = { responseType: 'text' as 'json' };

  constructor(private http: HttpClient) { }

  calculDuration(vitesse_moyene: number, lat1: number, lon1: number, lat2: number,lon2:number,autonomie:number, temps_recharge_min:number): Observable<any> {
    const body = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spy="info.802.calcul.soap">\
      <soapenv:Header/>
      <soapenv:Body>
        <spy:calculer_temps_trajet>
            <spy:vitesse_moyenne>${vitesse_moyene}</spy:vitesse_moyenne>
            <spy:lat1>${lat1}</spy:lat1>
            <spy:lon1>${lon1}</spy:lon1>
            <spy:lat2>${lat2}</spy:lat2>
            <spy:lon2>${lon2}</spy:lon2>
            <spy:autonomie>${autonomie}</spy:autonomie>
            <spy:temps_recharge_min>${temps_recharge_min}</spy:temps_recharge_min>
        </spy:calculer_temps_trajet>
      </soapenv:Body>
    </soapenv:Envelope>`;
    return this.http.post<any>(this.uri, body, this.options).pipe(
      map(value => {
        const data = value.split("calculer_temps_trajetResult");
        let res = data[1];
        res = res.replace(">","");
        res = res.replace("</tns:","");
        return res;
      })
    );
  }
}
