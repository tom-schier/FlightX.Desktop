import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatButtonToggleModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatSelectModule, MatCardModule} from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/security/auth.service';
import { UserService } from '../services/user/user.service';
import { AuthGuard } from '../services/security/auth.guard';
import { rootRouterConfig } from './app.routes';
import { UserResolver } from './user/user.resolver';
import { UserComponent } from './user/user.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MainComponent } from './main/main.component';
import { AircraftComponent } from './aircraft/aircraft.component';
import { FlightpathComponent } from './flightpath/flightpath.component';
import { WeatherComponent } from './weather/weather.component';
import { MapcontainerComponent } from './mapcontainer/mapcontainer.component';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AircraftDetailsComponent } from './aircraft/aircraft-detail.component';
import { AircraftWeightsComponent } from './aircraft/aircraft-weights.component';
import { AircraftListComponent } from './aircraft/aircraftlist.component';
import { AircraftSpeedsComponent } from './aircraft/aircraft-speeds.component';
import { TrackDataComponent } from './track-data/track-data.component';
import { WindDataComponent } from './weather/wind.component';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { AircraftEntryComponent } from './aircraft/aircraftentry.component';
import { FlightPlanComponent } from './flight-plan/flight-plan.component';
import { TestFirebaseComponent } from './test-firebase/test-firebase.component';
import { MongoDataService } from 'src/services/mongodata/mongo-data.service';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    MainComponent,
    AircraftComponent,
    FlightpathComponent,
    WeatherComponent,
    MapcontainerComponent,
    AircraftDetailsComponent,
    AircraftListComponent,
    AircraftWeightsComponent,
    AircraftSpeedsComponent,
    TrackDataComponent,
    WindDataComponent,
    AircraftEntryComponent,
    FlightPlanComponent,
    TestFirebaseComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NguiAutoCompleteModule,
     ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,   // imports firebase/firestore, only needed for database features
    AngularFireAuthModule,    // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFirestoreModule,   // imports firebase/firestore, only needed for database features
    AngularFireAuthModule,    // imports firebase/auth, only needed for auth features
  ],
  providers: [AuthService, UserService, UserResolver, AuthGuard, AuthService, UserService, UserResolver, AuthGuard,
    {provide: 'iLocationService', useClass: MongoDataService},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
