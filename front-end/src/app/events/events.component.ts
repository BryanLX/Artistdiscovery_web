import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import {Router} from "@angular/router";
import * as $ from 'jquery';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  constructor(private _dataService: DataService,
              private router: Router) { }
  users: Array<any>;
  current_user:any;

  ngOnInit() {

    this._dataService.getEvents()
        .subscribe(res => this.users = res);
    this.current_user = null;

    }

  select_user(i) {
    // this._dataService.getTwitterUser(id)
    //     .subscribe(res => this.current_user = res);
    // console.log(this.current_user);
    this.current_user = this.users[i];

    console.log(this.current_user);
    //fake ONE


    }




}

// $(function() {
//
//
//   var MongoClient = require('mongodb').MongoClient;
//   var url = "mongodb://localhost:27017/";
//   MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("social");
//     /*Return only the documents with the address "Park Lane 38":*/
//     var query = {};
//     dbo.collection("users").find().limit(10).toArray(function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       db.close();
//     });
//   });
//
//
// });
