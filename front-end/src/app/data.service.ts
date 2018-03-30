import { Injectable } from '@angular/core';
import { Http, Headers,  Jsonp, RequestOptions } from '@angular/http';


// import { Event } from './models';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  result:any;
  username:string;
  redirectURL:string;
  currentUser:any;

  private handleError(error: any): Promise<any> {
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }

  constructor(
    private _http: Http,
    private _jsonp: Jsonp) {
        this.username = null;
        this.currentUser = null;
    }


  // ===================== Validation and Test of USER ========================
  registerUser(member){
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      return this._http.post('/api/registration',member,{headers:headers})
        .map(result => result.json());
  }

  validateLogIn(user){
      if(user.username == undefined || user.activationToken==undefined) return false;
      return true;
  }

  authenticateUser(user){
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      return this._http.post('/api/authenticate',user,{headers:headers})
        .map(result => result.json());
  }

  storeUserData(member){
      this.eraseCookie("username");
      this.eraseCookie("user");

      this.setCookie("username",JSON.stringify(member.username),null);
      this.setCookie("user",JSON.stringify(member),null);

      // this.token = token;
      this.username = member.username;
      this.currentUser = member;
  }

  logout(){
      // this.token = null;
      this.username =  null;
      this.currentUser = null;
      this.eraseCookie("username");
      this.eraseCookie("user");
  }

  loadUserFromLocalStorage(){
      let username = this.getCookie("username");
      let user = this.getCookie("user");
      if(username){
          this.username = JSON.parse(username);
      }
      if(user){
          this.currentUser = JSON.parse(user);
      }
  }

  setRedirectURL(url){
      this.redirectURL = url;
  }

  clearRedirectURL(){
      this.redirectURL = '';
  }

  getCurrentUser() {
      // return this.currentUser;
      let rval =  this.getUserByUserName(this.username);
      return rval;
  }

  // ===================== End here ========================


  // ===================== Profile functions here ========================
  updateProfile(new_user){
      let headers = new Headers();
      headers.append('Content-Type','application/json');

      return this._http.put('/api/change/profile',new_user,{headers:headers})
                .map(result => result.json());
  }


  changePassword(newpass,a_user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');

    let data = {
        newpass:newpass,
        user : a_user
    };
    return this._http.put('/api/change/password',data,{headers:headers})
              .map(result => result.json());
  }

  loadEventsForUser(username){
      let headers = new Headers();
      headers.append('Content-Type','application/json');

      return this._http.get('/api/eventinfo/' + username)
                .map(result => result.json());
  }


  quitEvent(eventid){
      let headers = new Headers();
      headers.append('Content-Type','application/json');

      return this._http.delete('/api/quit/event/' + this.username + '/' + eventid)
                .map(result => result.json());
  }

  // ===================== eventjoin here ========================
  eventjoin(eventInfoForm){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    console.log(eventInfoForm);
    return this._http.post('/api/join/event',eventInfoForm,{headers:headers})
      .map(result => result.json());
 }


  // ===================== event join End here ========================
  getUsers() {
    return this._http.get("/api/users")
      .map(result => this.result = result.json().data);
  }


  getUserByUserName(username){
      let rval = this._http.get('/api/user/' + username)
        .map(result => result.json().data);
        return rval;
  }





  getEvents(){
    return this._http.get("api/events")
      .map(result => this.result = result.json().data)
  }

  getPeopleAttend(eventid){
    return this._http.get("api/peopleattend/" + eventid)
      .map(result => this.result = result.json().data)
      // .map(result => console.log(result.json().data))
  }


  getEventsByID(id){
    return this._http.get("api/events/" + id)
      .map(result => this.result = result.json().data)
  }

  getPlaceFromGoogle(lat, lng, type) {
    var api = "http://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="
    + lat + "," + lng + "&radius=500&type=" + type +"&key=AIzaSyALTjro5YYGzUdcGKOsXeyBQnTUVZzjkc4";
    return this._http.get(api)
      .map(result => this.result = result.json().results)
  }

  getMessage() {
    return this._http.get("api/messages")
      .map(result => this.result = result.json().data)
  }

  getCurrentMessage() {
    return this._http.get("api/messages/current")
      .map(result => this.result = result.json().data)
  }





  // cookie functions
  setCookie(cname, cvalue, minutes) {
    if(minutes){
        var d = new Date();
        d.setTime(d.getTime() + (minutes*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }else{
        document.cookie = cname + "=" + cvalue + ";path=/";
    }

  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
 }

 eraseCookie(name) {
    this.setCookie(name,"",-1);
 }
}
