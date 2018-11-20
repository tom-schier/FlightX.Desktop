import { Component } from '@angular/core';
import { AuthService } from '../../services/security/auth.service'
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = '';
  model: any = {};
  loading: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  
  }

  createForm() {
    this.loginForm = this.fb.group({
       email: ['', Validators.required ],
      // password: ['',Validators.required]
    });
  }

  tryFacebookLogin(){
    this.authService.doFacebookLogin()
    .then(res => {
      this.router.navigate(['/main']);
    })
  }

  tryTwitterLogin(){
    this.authService.doTwitterLogin()
    .then(res => {
      this.router.navigate(['/main']);
    })
  }

  tryGoogleLogin(){
    this.authService.doGoogleLogin()
    .then(res => {     
      this.router.navigate(['/main']);
    }, err => {
      console.log(err);
      this.loading = false;
      this.errorMessage = err.message;      
    })
  }

  tryLogin(value){
    this.loading = true;
    this.authService.doLogin(value)
    .then(res => {
      this.loading = false;
      this.router.navigate(['/main']);
    }, err => {
      console.log(err);
      this.loading = false;
      this.errorMessage = err.message;
    })
  }

  tryRegister(){
    this.authService.doRegister(this.model.email)
    .then(res => {
      this.router.navigate(['/main']);
    }, err => {
      console.log(err);
      this.loading = false;
      this.errorMessage = err.message;
    })
  }
}