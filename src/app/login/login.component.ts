import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/security/auth.service'
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/services/user/user.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {



  loginForm: FormGroup;
  errorMessageRegister: string = '';
  errorMessageGoogleLogin: string = '';
  errorMessageLogin: string = '';
  model: any = {};
  loading: boolean = false;
  _svc: AuthService;
  loginText: string;

  LoginTextWhenLoggedOut = 'Register with email';
  LoginTextWhenLoggedIn = 'Try Login';

  constructor(
    public authService: AuthService,
    private userSvc: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
    this._svc = authService;
    this.loginText = this.LoginTextWhenLoggedOut;
    this.errorMessageRegister = 'Register with your email address. A link will be forwarded to you  to sign in.'
    this.errorMessageGoogleLogin = 'Login with your Google account';
    this.errorMessageLogin = 'Login with your registered user name & password. You can request one.'
  }

  ngOnInit(): void {
    const url = window.location.origin + window.location.search;
    this.handleSignIn(url);
  }

  ngAfterViewInit(): void {
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      // password: ['',Validators.required]
    });
  }

  tryFacebookLogin() {
    this._svc.doFacebookLogin()
      .then(res => {
        this.router.navigate(['/main']);
      })
  }

  tryTwitterLogin() {
    this._svc.doTwitterLogin()
      .then(res => {
        this.router.navigate(['/main']);
      })
  }

  tryGoogleLogin() {
    this._svc.doGoogleLogin()
      .then(res => {
        this.router.navigate(['/main']);
      }, err => {
        console.log(err);
        // this.loading = false;
        this.errorMessageGoogleLogin = err.message;
      })
  }

  tryLogin() {
    // this.loading = true;
    this._svc.doLogin(this.model)
      .then(res => {
        //   this.loading = false;
        this.router.navigate(['/main']);
      }, err => {
        console.log(err);
        //  this.loading = false;
        this.errorMessageLogin = err.message;
      })
  }

  tryRegister() {
    this.userSvc.getCurrentUser().then(res => {
      if (res.length > 0) {
        console.log('toggleSignIn user is ' + JSON.stringify(res));
        this.loginText = this.LoginTextWhenLoggedIn;
        this.router.navigate(['/main']);

      }
      else {
        console.log('No user logged in  yet');
        var email = this.model.email;
        if (email == ''  || email == undefined) {
          this.errorMessageRegister = "A valid email ust be provided";
          return;
        }
        this.authService.doSendEmailLoginLink(email).then(res => {
          localStorage.setItem('emailForSignIn', email);
          this.errorMessageRegister = 'An email was sent to ' + email + '. Please use the link in the email to sign-in.';
        }, err => {
          this.errorMessageRegister = 'ERROR: Could not sent an email request. Try again.';
        });
      }
    }, rejected => {
      console.log('No user logged in  yet');
      this.loginText = this.LoginTextWhenLoggedOut;
      var email = this.model.email;
      if (email == '' || email == undefined) {
        this.errorMessageRegister = "A valid email ust be provided";
        return;
      }
      this.authService.doSendEmailLoginLink(email).then(res => {
        localStorage.setItem('emailForSignIn', email);
        this.errorMessageRegister = 'An email was sent to ' + email + '. Please use the link in the email to sign-in.';
      }, err => {
        this.errorMessageRegister = 'ERROR: Could not sent an email request. Try again.';
      });
    })
    if (this._svc.afAuth.auth.currentUser) {
      console.log("WHY AM I HERE ");
      this.router.navigate(['/main']);
    }
  }


  handleSignIn(url: string) {
    //check if I am coming from an email sign in link
    if (this._svc.afAuth.auth.isSignInWithEmailLink(url)) {
      var email = localStorage.getItem('emailForSignIn');
      console.log('email is: ' + email);
      if (email) {
        this.authService.doCompleteSignInViaEmail(email, url).then((result) => {
          console.log("in handleSigneId " + result);
          if (history && history.replaceState) {
            window.history.replaceState({}, document.title, url.split('?')[0]);
          }
          // Clear email from storage.
          console.log("in handleSigneId: removing email for signin");
          localStorage.removeItem('emailForSignIn');
          // Signed-in user's information.
          var user = result.user;
          console.log("in handleSigneId user object: " + user);
          var isNewUser = result.additionalUserInfo.isNewUser;
          console.log("in handleSigneId isNewUser: " + isNewUser);
          this.router.navigate(['/main/aircraft']);
          console.log(result)
        }, (error) => {
          console.log("ERROR in handleSigneId user object: " + error);
          this.errorMessageRegister = "ERROR in handleSigneId user object: " + error;
        });
      }
    }
    else {
      console.log('Not a sign in via email link' + url);
      this.userSvc.getCurrentUser().then(res => {
        if (res.length > 0) {
          console.log('toggleSignIn user is ' + JSON.stringify(res));
          this.loginText = this.LoginTextWhenLoggedIn;
          this.router.navigate(['/main']);
        }
        else {
          console.log('No user logged in  yet');
          this.loginText = this.LoginTextWhenLoggedOut;
        };
      }
        ,
        error => {
          console.log("Sign in handleSignIn: " + error);
          this.loginText = this.LoginTextWhenLoggedOut;
          //this.errorMessage = "Login with Google or Email";
          //this.errorMessageRegister = "Register with email";
        });
    }
  }
}