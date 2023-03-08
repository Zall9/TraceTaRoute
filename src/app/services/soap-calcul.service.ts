import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoapCalculService {

  private uri = 'https://soap-python.vercel.app/';
  private options = { responseType: 'text' as 'json' };

  constructor(private http: HttpClient) { }

  calculDuration(lat1: number, lon1: number, lat2: number, lon2: number, vitesse_km_h: number, temps_recharge_min: number, autonomie_km: number) {
    const url = 'https://soap-python.vercel.app';
    console.log("J'ai envoyer sur soapp");
    const options = {responseType: 'xml' as 'json'};
    const SoapData = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spy="mon_app_serveur.soap">
      <soapenv:Header/>
      <soapenv:Body>
        <spy:calculer_temps_trajetV2>
            <spy:vitesse_moyenne>${vitesse_km_h}</spy:vitesse_moyenne>
            <spy:lat1>${lat1}</spy:lat1>
            <spy:lon1>${lon1}</spy:lon1>
            <spy:lat2>${lat2}</spy:lat2>
            <spy:lon2>${lon2}</spy:lon2>
            <spy:autonomie>${autonomie_km}</spy:autonomie>
            <spy:temps_recharge_min>${temps_recharge_min}</spy:temps_recharge_min>
        </spy:calculer_temps_trajetV2>
      </soapenv:Body>
    </soapenv:Envelope>`;
    return this.http.post<any>(url, SoapData, options).pipe(
      map(value => {
        let res = value
          .split("<tns:calculer_temps_trajetV2Result>")[1]
          .split("</tns:calculer_temps_trajetV2Result>")[0];
        let hours = Math.floor(res);
        let minutes = Math.round((res - hours) * 60);
        res = `${hours}h${minutes}`;
        return res;
      })
    );
  }

}
