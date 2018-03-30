import { Component } from '@angular/core';
// Import the DataService
import { DataService } from './data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Define a users property to hold our user data
  events: Array<any>;
  current_user: string;
  showMessage = false;
  message = {"message": "Hello"}
  // Create an instance of the DataService through dependency injection
  constructor(private _dataService: DataService,
              private router:Router) {
    this._dataService.loadUserFromLocalStorage();
    // Access the Data Service's getUsers() method we defined
    this._dataService.getEvents()
        .subscribe(res => this.events = res);
    this.reload_navBar_logout();
  }

  ngOnInit(){
  }


  reload_navBar(){
      this.current_user = this._dataService.username;
      this._dataService.getCurrentMessage()
        .subscribe(res => {
          if (res) {
            this.message = res;
            this.showMessage = true;
          } else {
            this.showMessage = false;
          }
        });
  }

  reload_navBar_logout(){
      this.current_user = this._dataService.username;
  }

  LogoutUser(){
      this._dataService.logout();
      this.reload_navBar_logout();
      this.showMessage = false;
      this.router.navigate(['/login']);
  }




  // use navigate instrad of href to block refreshing
  signup_click(){
      this.router.navigate(['/signup']);
  }

  login_click(){
      this.router.navigate(['/login']);
  }

  profile_click(){
      this.router.navigate(['/profile']);
  }

  events_click(){
      this.router.navigate(['/events']);
  }

  home_click(){
      this.router.navigate(['/home']);
  }

  closeMessage() {
    this.showMessage = false;
  }

  artist_click(){
      this.router.navigate(['/artist']);
  }





}
