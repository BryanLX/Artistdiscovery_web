import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import {MemberForm} from '../models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {


  //harcode user
  alert_msg:string;
  new_password:string;
  confirm_password:string;
  joinedEvents:Array<any>;
  messages:Array<any>;
  // joinedEvents =[
  //   {
  //     "_id": "5a1c8f8ae85d6b5d0dcef3b1",
  //     "name": "Toronto",
  //     "description": "FDSF fsdFDf faeffg asdbfg gagrg adg"
  //   },
  //   {
  //     "_id": "5a1c8f8ae85d6b5d0dcef3b1",
  //     "name": "Xiboliya",
  //     "description": "FDddfd SF fsdFDf faeffg asdbfg gagrg adg"
  //   }
  // ]

  currentUser;
  inputUser:any;
  constructor(private _dataService: DataService,
              private router: Router) {
      this.currentUser  = {};
      this.alert_msg = "";
      this.new_password ="";
      this.confirm_password="";
      this.inputUser = new MemberForm();
  }

  ngOnInit() {
    this._dataService.getCurrentUser().subscribe(data=>{
        this.currentUser = data;
        this.inputUser = JSON.parse(JSON.stringify(data));
        if(!data){
            this.router.navigate(['/login']);
        }else{
            // load all events for this user
            this._dataService.loadEventsForUser(this.currentUser.username).subscribe(data2=>{
                if(data2.success){
                    this.joinedEvents = data2.events;
                }else{
                    this.alert_msg = data2.msg;
                }
            })
        }
    });

    this._dataService.getMessage()
      .subscribe(res => this.messages = res)
  }


  saveChange(){

      // fill all fields
      if(!this.validateChange()) return false;

      // validate phone -> function
      if(!this.validatePhoneNumber()) return false;

      // validate email -> function
      if(!this.validateEmail()) return false;


      this._dataService.updateProfile(this.inputUser).subscribe(data=>{
          if(data.success){
              alert("Updated!");

              // trigger reload_navBar,not necessary if username is fixed
              this.router.navigate(['/profile']);

          }else{
              this.alert_msg = data.msg;
          }
      })


  }




  quitEvent(eventid){
      this._dataService.quitEvent(eventid).subscribe(data=>{
          if(data.success){
              alert("Event Removed!");
              this._dataService.loadEventsForUser(this.currentUser.username).subscribe(data2=>{
                  if(data2.success){
                      this.joinedEvents = data2.events;
                      this.router.navigate(['/profile']);
                  }else{
                      this.alert_msg = data2.msg;
                  }
              })
          }else{
              this.alert_msg = data.msg;
          }

      })
  }

  setPassword(){



      if(!this.passwordCheck()) return false;

      this._dataService.changePassword(this.new_password,this.currentUser).subscribe(data=>{
          if(data.success){
              alert("Password Changed");
              this.router.navigate(['/profile']);
          }else{
              this.alert_msg = data.msg;
          }
      })

  }


  // reset the modified data from the profile html
  reset(){
    this.inputUser = JSON.parse(JSON.stringify(this.currentUser));
    this.router.navigate(['/profile']);
  }




  // =================== Input Fields Vadalidation ========================
  validateChange(){
    let check = true;
    if(!this.inputUser.firstName) check=false;
    if(!this.inputUser.lastName) check=false;
    if(!this.inputUser.username) check=false;
    if(!this.inputUser.phone) check=false;
    if(!this.inputUser.email) check=false;

    if(!check){
        this.alert_msg = "Please fill all fields";
    }
    return check;
  }


  validatePhoneNumber(){
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      var phone = String(this.inputUser.phone);
      if(!phone.match(phoneno)){
          this.alert_msg = "Invalid Phone Number";
          return false;
      }
      this.inputUser.phone = phone.replace(/-/g,"");
      return true;
  }


  validateEmail(){
      let email = this.inputUser.email;
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email)){
          this.alert_msg = "Invalid Email Address";
          return false;
      }
      return true;
  }








  passwordCheck(){
    if( this.new_password.length < 3){
        this.alert_msg = "new password too short";
        return false;
    }
    if( this.new_password!=this.confirm_password){
      this.alert_msg = "new password does not match";
      return false;
    }
    return true;
  }

}
