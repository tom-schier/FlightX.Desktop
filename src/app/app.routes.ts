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

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'main', component: MainComponent,  resolve: { data: UserResolver}},
  { path: 'aircraft', outlet: "section1", component: AircraftComponent,  resolve: { data: UserResolver}},
  { path: 'flightpath', outlet: "section1", component: FlightpathComponent,  resolve: { data: UserResolver}},
  { path: 'weather', outlet: "section1", component: WeatherComponent,  resolve: { data: UserResolver}}
 // { path: 'user', component: UserComponent,  resolve: { data: UserResolver}}
];
