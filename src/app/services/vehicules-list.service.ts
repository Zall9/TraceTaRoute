import {Injectable} from '@angular/core';
import {Apollo, ApolloBase, gql} from "apollo-angular";
import {BehaviorSubject, EMPTY, map, Observable, tap} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class VehiculesListService {
  autonomy!: number;
  apollo: ApolloBase;

  constructor(private apolloProvider: Apollo) {
    this.apollo = apolloProvider.use('chargeTrip');
  }

  findCarInfo(id: number|undefined) {
    return this.apollo.watchQuery({
      query: gql`
        query vehicle {
          vehicle(id: "${id}") {
            id
            range {
              chargetrip_range {
                best
                worst
              }
            }
          }
        }
        `,
    }).valueChanges.pipe(
      map((value: any) => {
        const best = value.data.vehicle.range.chargetrip_range.best;
        const worst = value.data.vehicle.range.chargetrip_range.worst;
        return (best + worst) / 2;
      }),
      tap(value => this.autonomy = value)
    )
  }

  searchCars(car: string): Observable<any> {
    return this.apollo.watchQuery({
      query: gql`
        query vehicleListAll {
          vehicleList(size: 2, search: "${car}") {
            id
            naming {
              model
            }
          }
        }
        `,
    }).valueChanges.pipe(
      tap(value => value)
    );
  }
}

