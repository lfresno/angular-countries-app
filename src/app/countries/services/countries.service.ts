import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { Country } from '../interfaces/country';


@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl:string = 'https://restcountries.com/v3.1';

  constructor(private http: HttpClient) { }

  searchCountryByAlphaCode(code:string): Observable<Country[]>{
    //configuracion de la solicitud
    const url:string = `${this.apiUrl}/alpha/${code}`
    return this.http.get<Country[]>(url)
      .pipe(
        catchError(error => of([])) //si hay un error en la búsqueda (ej: una búsqueda que no sea válida), se vacía el array
      );
  }

  searchCapital(term:string ): Observable<Country[]> {
    //configuracion de la solicitud
    const url:string = `${this.apiUrl}/capital/${term}`
    return this.http.get<Country[]>(url)
      .pipe(
        // tap(countries => console.log("paso por el tap", countries)),  //hago algo cada vez que paso por aquí
        // map(countries => []), //mapeo y modifico la info
        catchError(error => of([])) //si hay un error en la búsqueda (ej: una búsqueda que no sea válida), se vacía el array
      );
  }

  searchCountry(term:string ): Observable<Country[]> {

    //configuracion de la solicitud
    const url:string = `${this.apiUrl}/name/${term}`
    return this.http.get<Country[]>(url)
      .pipe(
        catchError(error => of([])) //si hay un error en la búsqueda (ej: una búsqueda que no sea válida), se vacía el array
      );
  }


  searchRegion(term:string ): Observable<Country[]> {

    //configuracion de la solicitud
    const url:string = `${this.apiUrl}/region/${term}`
    return this.http.get<Country[]>(url)
      .pipe(
        catchError(error => of([])) //si hay un error en la búsqueda (ej: una búsqueda que no sea válida), se vacía el array
      );
  }

}

