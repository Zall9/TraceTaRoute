import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PriceServiceService {

  constructor(private http: HttpClient) { }

  getPrices(kilometers:number):Observable<any> {
    return this.http.get("http://localhost:5001/price/" + kilometers).pipe(
      tap((data) => console.log(data))
    );
  }
}
