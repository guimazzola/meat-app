import { Component, OnInit } from '@angular/core';
import { Restaurant } from './restaurant/restaurant.model';
import { RestaurantsService } from './restaurants.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/from';
import { Observable } from 'rxjs';

@Component({
  selector: 'mt-restaurants',
  templateUrl: './restaurants.component.html',
  animations: [
    trigger('toggleSearch', [
      state('hidden', style({
        opacity: 0,
        "max-height": "0px"
      })),
      state('visible', style({
        opacity: 1,
        "max-height": "70px",
        "margin-top": "20px"
      })),
      transition('* => *', animate('250ms 0s ease-in-out'))
    ])
  ]
})
export class RestaurantsComponent implements OnInit {

  searchBarState = 'hidden'
  restaurants: Restaurant[]

  searchForm: FormGroup
  searchControl: FormControl

  constructor(private RestaurantsService: RestaurantsService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.searchControl = this.fb.control('')
    this.searchForm = this.fb.group({
      searchControl: this.searchControl
    })

    this.searchControl.valueChanges
      //esperar 500ms entre dois eventos
      .debounceTime(500)
      //emitir somente eventos unicos, sem repeticao
      .distinctUntilChanged()
      //troca searchterm por observable de restaurants
      .switchMap(searchTerm => this.RestaurantsService
        .restaurants(searchTerm)
        .catch(error => Observable.from([])))
      .subscribe(restaurants => this.restaurants = restaurants)

    this.RestaurantsService.restaurants()
      .subscribe(restaurants => this.restaurants = restaurants)
  }

  toogleSearch() {
    this.searchBarState = this.searchBarState === 'hidden' ? 'visible' : 'hidden'
  }

}
