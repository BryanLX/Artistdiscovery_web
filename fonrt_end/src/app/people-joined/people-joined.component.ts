import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

import { ActivatedRoute, Params, Router }   from '@angular/router';
import { Location }                 from '@angular/common';

@Component({
  selector: 'app-people-joined',
  templateUrl: './people-joined.component.html',
  styleUrls: ['./people-joined.component.css']
})
export class PeopleJoinedComponent implements OnInit {

  constructor(
    private _dataService: DataService,
    private route: ActivatedRoute,
    private location: Location,
    private router : Router) { }
  // users = ["userA", "userB"]
  users: Array<any>;
  
  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this._dataService.getPeopleAttend(params['id']))
      .subscribe(attend => this.users = attend);
    // this.route.params
    //   .subscribe(params => this.eventid = params['id']);
  }
}
