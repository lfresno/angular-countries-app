import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';

import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cacheStore.interface';
import { Region } from '../interfaces/region.type';

//LOS SERVICIOS SOLO SE INICIALIZAN UNA VEZ Y LUEGO SE REUTILIZAN

//la información que tenga que ser persistente en una misma sesión se puede guardar aquí, ya que
//las páginas sí que se reinicializan cada vez que se abren. También se puede hacer esto con localStorage

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl:string = 'https://restcountries.com/v3.1';

  public cacheStore:CacheStore = {
    byCapital:    { term: '', countries: []},
    byCountries:  { term: '', countries: []},
    byRegion:     { region: '', countries: []},
  };


  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
   }

  //guarda info en localStorage para qu ese mantenga entre sesiones (al recargar el navegador)
  private saveToLocalStorage() {  //lo usamos cada vez que se modifica la info de cacheStore
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage() {
    if(!localStorage.getItem('cacheStore')) return; //si no estña guardado, return

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  //este método se usa para no repetirlo tantas veces y que el código sea más limpio
  private getCountriesRequest(url:string ): Observable<Country[]> {

    //EN EL SERVICIO NO HACE FALTA CANCELAR LAS SUSCRIPCIONES, ANGULAR LO HACE AUTOMATICO
    //TAMPOCO HACE FALTA EN OBSERVABLES QUE VIENEN DE ANGULAR/COMMON (ej http)

    return this.http.get<Country[]>(url)
      .pipe(  //pipe recibe tantos operadores rxjs como nosotros queramos
        // tap(countries => console.log("paso por el tap", countries)),  //hago algo cada vez que paso por aquí
        // map(countries => []), //mapeo y modifico la info
        catchError(error => of([])), //si hay un error en la búsqueda (ej: una búsqueda que no sea válida), se vacía el array
        //delay(2000),  //espera dos segundos a dar la respuesta (se espera para hacer pruebas con el loading)
      );
  }

  searchCountryByAlphaCode(code:string): Observable<Country | null>{
    //configuracion de la solicitud
    const url:string = `${this.apiUrl}/alpha/${code}`
    return this.http.get<Country[]>(url)
      .pipe(
        //si encuentra países, devuelve el primero de ellos, si no, devuelve nulo
        map(countries => countries.length > 0 ? countries[0] : null),
        catchError(error => of(null)) //si hay un error en la búsqueda (ej: una búsqueda que no sea válida), se vacía el array
      );
  }

  searchCapital(term:string ): Observable<Country[]> {
    //configuracion de la solicitud
    const url:string = `${this.apiUrl}/capital/${term}`;

    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byCapital = {term, countries}),
        tap(() => this.saveToLocalStorage())  //es recomendable esta sintaxis
      );
  }

  searchCountry(term:string ): Observable<Country[]> {

    //configuracion de la solicitud
    const url:string = `${this.apiUrl}/name/${term}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => {
          this.cacheStore.byCountries.countries = countries;
          this.cacheStore.byCountries.term = term;
        }), //se ejecuta el tap pero no afecta al funcionamiento de lo demás
        tap(() => this.saveToLocalStorage())
      );
  }


  searchRegion(region:Region ): Observable<Country[]> {

    //configuracion de la solicitud
    const url:string = `${this.apiUrl}/region/${region}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byRegion = {region, countries}),
        tap(() => this.saveToLocalStorage())
      );
  }

}

