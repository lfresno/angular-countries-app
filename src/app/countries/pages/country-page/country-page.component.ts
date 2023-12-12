import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: ``
})
export class CountryPageComponent implements OnInit{

  constructor(private activatedRoute:ActivatedRoute,  private countriesService: CountriesService) {}

  ngOnInit(): void {
    this.activatedRoute.params
    .pipe(
      switchMap(({id}) => this.countriesService.searchCountryByAlphaCode(id))
    )
    .subscribe(country => {
      console.log({country});
     });
  }

}
