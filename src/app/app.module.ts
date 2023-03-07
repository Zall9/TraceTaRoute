import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule, HttpHeaders} from '@angular/common/http';
import { CalculComponent } from './components/calcul/calcul.component';
import { FormsModule } from '@angular/forms';
import { MapComponent } from './components/map/map.component';
import { GraphQLModule } from './graphql.module';
import {APOLLO_NAMED_OPTIONS, APOLLO_OPTIONS, NamedOptions} from "apollo-angular";
import {HttpLink} from "apollo-angular/http";
import {InMemoryCache} from "@apollo/client/core";

@NgModule({
  declarations: [
    AppComponent,
    CalculComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    GraphQLModule
  ],
  providers:  [
    {
      provide: APOLLO_NAMED_OPTIONS, // <-- Different from standard initialization
      useFactory(httpLink: HttpLink): NamedOptions {
        return {
          chargeTrip: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: 'https://api.chargetrip.io/graphql',
              headers:new HttpHeaders({
                'x-client-id': '64073df55fdc57484bfc8ddc',
                'x-app-id':'64073df55fdc57484bfc8dde'
              })
            }),
          },
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
