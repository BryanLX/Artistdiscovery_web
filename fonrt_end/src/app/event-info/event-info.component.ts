import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { EventInfoForm } from '../models';
import { ActivatedRoute, Params, Router }   from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Location }                 from '@angular/common';
import { Event } from '../models';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.css']
})
export class EventInfoComponent implements OnInit {

  constructor(
    private _dataService: DataService,
    private route: ActivatedRoute,
    private location: Location,
    private router : Router,
  ) { }
  eventInfoForm = new EventInfoForm();
  hasVehicle = false;
  checkRequired = true;

  event: Event;

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this._dataService.getEventsByID(params['id']))
      .subscribe(event => {
        this.event = event;
      });
  }

  haveVehicle(sel) {
    if(sel == "true"){
      this.hasVehicle = true;
      this.eventInfoForm.ifVehicle = true;
      this.eventInfoForm.seatsAvailable = null;
    } else if (sel == "false"){
      this.hasVehicle = false;
      this.eventInfoForm.ifVehicle = false;
      this.eventInfoForm.seatsAvailable = 0;
    } else {
      this.hasVehicle = null;
      this.eventInfoForm.ifVehicle = null;
      this.eventInfoForm.seatsAvailable = null;
    }
  }

  peopleAttend(sel){
    if (sel == "1"){
      this.eventInfoForm.peopleAttend = 1;
    } else if (sel == "2"){
      this.eventInfoForm.peopleAttend = 2;
    }
    else if (sel == "3"){
      this.eventInfoForm.peopleAttend = 3;
    }
    else if (sel == "4"){
      this.eventInfoForm.peopleAttend = 4;
    } else {
      this.eventInfoForm.peopleAttend = null;
    }
  }

  seatsAvailable(sel){
    if (sel == "0"){
      this.eventInfoForm.seatsAvailable = 0;
    } else if (sel == "1"){
      this.eventInfoForm.seatsAvailable = 1;
    }
    else if (sel == "2"){
      this.eventInfoForm.seatsAvailable = 2;
    }
    else if (sel == "3"){
      this.eventInfoForm.seatsAvailable = 3;
    }
    else if (sel == "4"){
      this.eventInfoForm.seatsAvailable = 4;
    } else {
      this.eventInfoForm.seatsAvailable = null;
    }
  }

  setnote(){
    var inputValue = (<HTMLInputElement>document.getElementById('note')).value;
    this.eventInfoForm.note = inputValue;
  }

  checkAllInfo() {
    if (this.hasVehicle == null ||
        this.eventInfoForm.peopleAttend == null ||
        this.eventInfoForm.seatsAvailable == null ){
        this.checkRequired = false;
    }
    else {
      this.checkRequired = true;
    }
  }
  submit(){
    this.setnote()
    this.checkAllInfo()
    if (this.checkRequired){
      this.eventInfoForm.eventid = this.event._id;
      this.eventInfoForm.name = this.event.name;
      this.eventInfoForm.username = this._dataService.username;
      this._dataService.eventjoin(this.eventInfoForm).subscribe(data =>{
        alert(data.msg);
        if(data.success){
            this.router.navigate(['/profile']);
        }else{
            var eventUrl = '/eventinfo/' + this.event._id;
            this.router.navigate([eventUrl]);
        }
      })
    }
  }

}
