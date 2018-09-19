import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/security/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private _authSvc: AuthService, private router: Router) {}

  ngOnInit() {
  }

  doLogout(){
    this._authSvc.doLogout().then(val => {
      this.router.navigate(['/login']);
      console.log("Logout successful");
    })
  }

}
