import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { UserResolver } from './user/user.resolver';
import { AuthGuard } from '../services/security/auth.guard';
import { MainComponent } from './main/main.component';
import { AircraftComponent } from './aircraft/aircraft.component';
import { WeatherComponent } from './weather/weather.component';
import { FlightpathComponent } from './flightpath/flightpath.component';
import { MapcontainerComponent } from './mapcontainer/mapcontainer.component';
import { AircraftDetailsComponent } from './aircraft/aircraft-detail.component';
import { FlightPlanComponent } from './flight-plan/flight-plan.component';
import { EmailSigninComponent } from './email-signin/email-signin.component';

export const rootRouterConfig: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'prefix' },
    { path: 'login', component: LoginComponent}, 
    { path: 'register', component: RegisterComponent },
    {
        path: 'main', component: MainComponent, resolve: { data: UserResolver }, children: [
            { path: '', component: AircraftDetailsComponent,  },
            { path: 'aircraft', component: AircraftDetailsComponent,  },
            { path: 'flightpath', component: FlightpathComponent,  },
            { path: 'flightplan', component: FlightPlanComponent,  },
            { path: 'weather', component: WeatherComponent,  }]
    }
    // { path: 'user', component: UserComponent,  resolve: { data: UserResolver}}
];
