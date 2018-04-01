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

  ngOnInit() {

    this._dataService.getEvents()
        .subscribe(res => this.users = res);
    }

  // readMore(eventid){
  //     this.router.navigate(['/map/' + eventid]);
  // }


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
