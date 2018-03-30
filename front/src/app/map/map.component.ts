import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router }   from '@angular/router';
import { Location }                 from '@angular/common';

import { Event } from '../models';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})

export class MapComponent implements OnInit {

  constructor(
    private _dataService: DataService,
    private route: ActivatedRoute,
    private location: Location,
    private router : Router,
  ) { }
  event: Event;

  // event = {
  //         "name": "Toronto",
  //   			"briefdescription":"Toronto is Canada's largest city, the fourth largest in North America, and home to a diverse population of about 2.8 million people. It's a global centre for business, finance, arts and culture and is consistently ranked one of the world's most livable cities.",
  //         "date": "Dec 25th, 2017",
  //         "image": "image/toronto.jpg",
  //         "departLat": 43.659719,
  //         "departLng": -79.396889,
  //         "destLat": 43.647487,
  //         "destLng": -79.379254,
  //         "description": ["Toronto Day 1", "Toronto Day 2", "Toronto Day 3"],
  //   			"id": "0",
  //         "_id": "5a1f6f8f2b59504122c7af1f"
  //   		};

  descriptionIndex = 0;
  restaurant_markers = [];
  mall_markers = [];
  cafe_markers = [];

  api_type =
  {
    "restaurant": "restaurant",
    "shopping_mall": "shopping_mall",
    "coffee_shop": "cafe"
  }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this._dataService.getEventsByID(params['id']))
      .subscribe(event => {
        this.event = event;
      });
  }

  changeDescriptionIndex(index){
    this.descriptionIndex = parseInt(index);
    document.getElementById("dropcontent").classList.toggle("show");
  }

  getRestaurant() {
    if (event != null){
        this.restaurant_markers = this.getPlace(
            this.event.destLat, this.event.destLng,
            this.event.departLat,this.event.departLng,
            this.api_type["restaurant"]);
        this.mall_markers = [];
        this.cafe_markers = [];
    }
  }

  getShoppingMall() {
    if (event != null){
        this.mall_markers = this.getPlace(
            this.event.destLat, this.event.destLng,
            this.event.departLat,this.event.departLng,
            this.api_type["shopping_mall"]);
        this.restaurant_markers = [];
        this.cafe_markers = [];
    }
  }

  getCafe() {
    if (event != null){
        this.cafe_markers = this.getPlace(
            this.event.destLat, this.event.destLng,
            this.event.departLat,this.event.departLng,
            this.api_type["coffee_shop"]);
        this.mall_markers = [];
        this.restaurant_markers = [];
    }
  }

  getPlace(destLat, destLng, departLat, departLng, type){
    var list = []
    this._dataService.getPlaceFromGoogle(departLat, departLng, type)
            .subscribe(res => {
              var places = res;
              for (var i = 0; i < places.length; i++){
               var lat = places[i].geometry.location.lat;
               var lng = places[i].geometry.location.lng;
               var marker = {"lat": lat, "lng": lng};
               list.push(marker);
              }
            });
    this._dataService.getPlaceFromGoogle(destLat, destLng, type)
            .subscribe(res => {
              var places = res;
              for (var i = 0; i < places.length; i++){
                var lat = places[i].geometry.location.lat;
                var lng = places[i].geometry.location.lng;
                var marker = {"lat": lat, "lng": lng};
                list.push(marker);
              }
            });
    return list;
  }

  joinEvent(){
      var eventUrl = '/eventinfo/' + this.event._id;


      if(this._dataService.username){
          this.router.navigate([eventUrl]);
      }else{
          this._dataService.setRedirectURL(eventUrl);
          this.router.navigate(['/login']);
      }

  }

}
