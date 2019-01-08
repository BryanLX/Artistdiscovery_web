import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from '../../map-src/agm-direction.module';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AppComponent } from './app.component';
import { JsonpModule, Jsonp, Response} from '@angular/http';

// Import the Http Module and our Data Service
import { HttpModule } from '@angular/http';
import { DataService } from './data.service';
import { HomeComponent } from './home/home.component';
import { EventsComponent } from './events/events.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MapComponent } from './map/map.component';
import { EventjoinComponent } from './eventjoin/eventjoin.component';
import { EventInfoComponent } from './event-info/event-info.component';
import { ProfileComponent } from './profile/profile.component';
import { PeopleJoinedComponent } from './people-joined/people-joined.component';
import { ArtistComponent } from './artist/artist.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventsComponent,
    LoginComponent,
    SignupComponent,
    MapComponent,
    EventjoinComponent,
    EventInfoComponent,
    ProfileComponent,
    PeopleJoinedComponent,
    ArtistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCKdcC6KXZea4gZ2tDW9JoYJT35jb8YH9w"
    }),
    AgmDirectionModule,
    AgmSnazzyInfoWindowModule,
    JsonpModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
