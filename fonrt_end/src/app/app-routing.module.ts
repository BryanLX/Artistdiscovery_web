import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent} from './home/home.component';
import { EventsComponent} from './events/events.component';
import { LoginComponent} from './login/login.component';
import { SignupComponent} from './signup/signup.component';
import { ProfileComponent} from './profile/profile.component';
import { MapComponent} from './map/map.component';
import { EventjoinComponent} from './eventjoin/eventjoin.component';
import { EventInfoComponent} from './event-info/event-info.component';
import { PeopleJoinedComponent} from './people-joined/people-joined.component';
import { ArtistComponent} from './artist/artist.component';



const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'events',
        component: EventsComponent
    },
    {
        path: 'map/:id',
        component: MapComponent
    },
    {
        path: 'eventjoin/:id',
        component: EventjoinComponent
    },
    {
        path: 'eventinfo/:id',
        component: EventInfoComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'peopleattend/:id',
        component: PeopleJoinedComponent
    },
    {
        path: 'artist',
        component: ArtistComponent
    },
]

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}
