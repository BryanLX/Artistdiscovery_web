import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  constructor(private _dataService: DataService,
              private router: Router) { }
  events: Array<any>;

  ngOnInit() {
    this._dataService.getEvents()
        .subscribe(res => this.events = res);
    }

  readMore(eventid){
      this.router.navigate(['/map/' + eventid]);
  }


}
