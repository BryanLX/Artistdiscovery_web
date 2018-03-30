import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { EventJoinForm } from '../models';

@Component({
  selector: 'app-eventjoin',
  templateUrl: './eventjoin.component.html',
  styleUrls: ['./eventjoin.component.css']
})
export class EventjoinComponent implements OnInit {

  constructor(private _dataService: DataService) { }
  eventJoinForm = new EventJoinForm();
  hasVehicle = false;
  checkRequired = true;

  ngOnInit() {
  }

  haveVehicle(sel) {
    if(sel == "true"){
      this.hasVehicle = true;
    } else {
      this.hasVehicle = false;
      this.eventJoinForm.peopleAttend = 0;
      this.eventJoinForm.seatsAvailable = 0;
    }
  }

  peopleAttend(sel){
    if (sel == "1"){
      this.eventJoinForm.peopleAttend = 1;
    } else if (sel == "2"){
      this.eventJoinForm.peopleAttend = 2;
    }
    else if (sel == "3"){
      this.eventJoinForm.peopleAttend = 3;
    }
    else if (sel == "4"){
      this.eventJoinForm.peopleAttend = 4;
    } else {
      this.eventJoinForm.peopleAttend = 0;
    }
  }

  seatsAvailable(sel){
    if (sel == "1"){
      this.eventJoinForm.seatsAvailable = 1;
    } else if (sel == "2"){
      this.eventJoinForm.seatsAvailable = 2;
    }
    else if (sel == "3"){
      this.eventJoinForm.seatsAvailable = 3;
    }
    else if (sel == "4"){
      this.eventJoinForm.seatsAvailable = 4;
    } else {
      this.eventJoinForm.seatsAvailable = 0;
    }
  }

  checkAllInfo() {
    if (! this.eventJoinForm.firstName ||
        ! this.eventJoinForm.lastName ||
        ! this.eventJoinForm.email ||
        ! this.eventJoinForm.phoneNumber){
        this.checkRequired = false;
    }
    else {
      this.checkRequired = true;
    }
  }
  submit(){
    this.checkAllInfo()
    if (this.checkRequired){
      //submit the form...
      console.log("submit")
    }
  }

}
