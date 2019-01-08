import { Component, OnInit } from '@angular/core';
import { LogInForm } from '../models';
import {MemberForm} from '../models';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  user:any;
  member:any;
  alert_msg:string;
  constructor(private _dataService:DataService,
              private router:Router,
              private appComponent:AppComponent) {
      this.user = new LogInForm();
      this.member = new MemberForm();
      this.alert_msg="";
  }

  ngOnInit() {

  }

  authorization(){
      if(!this.completeValidation()){
          this.alert_msg = "Please fill all the fields";
          return;
      }

      this._dataService.authenticateUser(this.user).subscribe(data=>{
          if(data.success){
              this._dataService.storeUserData(data.user);
              this.appComponent.reload_navBar();
              if(this._dataService.redirectURL){
                  let target = this._dataService.redirectURL;
                  this._dataService.clearRedirectURL();
                  this.router.navigate([target]);
              }else{
                  this.router.navigate(['/profile']);
              }
          }else{
              this.alert_msg = data.msg;
              console.log("Username or password incorrect!");
              this.router.navigate(['/login']);
          }
      })
  }




  // ================ FORMATTED Varifier  =========================
  completeValidation(){
    return this.user.username && this.user.password;
  }


}
