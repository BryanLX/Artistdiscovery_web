import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MemberForm } from '../models';
import {Router} from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  member:any;
  repeat_pass:string;
  alert_msg:string;

  constructor(
      private _dataService:DataService,
      private router:Router,
      private appComponent:AppComponent) {
      this.member = new MemberForm();
      this.member.permission = 0;
      this.member.socialMedia = 'wechat';
      this.alert_msg="";
  }

  ngOnInit() {
  }


  check_signup(){

      // check required fields
      if(!this.validateRegister()) return false;

      // check Phone Number
      if(!this.validatePhoneNumber()) return false;

      // check Email
      if(!this.validateEmail()) return false;

      // check pass and repeat_pass isMatch
      if(!this.validatePassword()) return false;

      // try to register the user
      this._dataService.registerUser(this.member).subscribe(data =>{
        if(data.success){
            this.alert_msg="";
            alert("Registration Successfully!");
            this._dataService.storeUserData(this.member);
            this.appComponent.reload_navBar();
            this.router.navigate(['/profile']);
        }else{
            this.alert_msg = data.msg;
            this.router.navigate(['/signup']);
        }
      })

  }

  // ================ FORMATTED INPUT STREAM VALIDATION =======================
  validateRegister(){
    let member = this.member;
    let check = true;
    if(this.member.firstName == undefined) check=false;
    if(this.member.lastName == undefined) check=false;
    if(this.member.username == undefined) check=false;
    if(this.member.phone == undefined) check=false;
    if(this.member.email == undefined) check=false;
    if(this.member.activationToken == undefined) check=false;

    if(!check){
        this.alert_msg = "Please fill all fields";
    }
    return check;
  }

  validateEmail(){
      let email = this.member.email;
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email)){
          this.alert_msg = "Invalid Email Address";
          return false;
      }
      return true;
  }

  validatePassword(){
      let check = this.member.activationToken;
      if(check.length < 3) {
          this.alert_msg = "Password too short";
          return false;
      }
      if(check != this.repeat_pass) {
          this.alert_msg = "Password don't match"
          return false;
      }
      return true;
  }

  validatePhoneNumber(){
      var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if(!this.member.phone.match(phoneno)){
          this.alert_msg = "Invalid Phone Number";
          return false;
      }
      this.member.phone = this.member.phone.replace(/-/g,"");
      return true;
  }

}
