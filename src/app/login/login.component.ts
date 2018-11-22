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
  errorMessage: string = '';
  model: any = {};
  loading: boolean = false;
  _svc: AuthService;

  constructor(
    public authService: AuthService,
    private userSvc: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
    this._svc = authService;
  }

  ngOnInit(): void {
    const url = window.location.origin + window.location.search;
    this.handleSignIn(url);
  //  this.handleSignIn(url);
    //this.confirmSignIn(url);
  }

  ngAfterViewInit(): void {
    // const url = window.location.origin + window.location.search;
    // this.handleSignIn(url);
  }

  // async confirmSignIn(url) {
  //   try {
  //     if (this._svc.afAuth.auth.isSignInWithEmailLink(url)) {
  //       let email = window.localStorage.getItem('emailForSignIn'); 
  //       // If missing email, prompt user for it
  //       if (!email) {
  //         email = window.prompt('Please provide your email for confirmation');
  //       }  
  //       // Signin user and remove the email localStorage
  //       const result = await this._svc.afAuth.auth.signInWithEmailLink(email, url);
  //       window.localStorage.removeItem('emailForSignIn');
  //     }
  //   } catch (err) {
  //     this.errorMessage = err.message;
  //   }
  // }

  createForm() {
    this.loginForm = this.fb.group({
       email: ['', Validators.required ],
      // password: ['',Validators.required]
    });
  }

  tryFacebookLogin(){
    this._svc.doFacebookLogin()
    .then(res => {
      this.router.navigate(['/main']);
    })
  }

  tryTwitterLogin(){
    this._svc.doTwitterLogin()
    .then(res => {
      this.router.navigate(['/main']);
    })
  }

  tryGoogleLogin(){
    this._svc.doGoogleLogin()
    .then(res => {     
      this.router.navigate(['/main']);
    }, err => {
      console.log(err);
     // this.loading = false;
      this.errorMessage = err.message;      
    })
  }

  tryLogin(value){
   // this.loading = true;
    this._svc.doLogin(value)
    .then(res => {
   //   this.loading = false;
      this.router.navigate(['/main']);
    }, err => {
      console.log(err);
    //  this.loading = false;
      this.errorMessage = err.message;
    })
  }

  tryRegister(){
    this._svc.doRegister(this.model.email)
    .then(res => {
      this.router.navigate(['/main']);
    }, err => {
      console.log(err);
    //  this.loading = false;
      this.errorMessage = err.message;
    })
  }


      /**
     * Handles the sign in button press.
     */
    toggleSignIn() {
      // Disable the sign-in button during async sign-in tasks.
      //this.loading = true;
      this.userSvc.getCurrentUser().then(res => {
        if (res.length > 0) {
          console.log('toggleSignIn user is ' + JSON.stringify(res));
          this.router.navigate(['/main']);
        }
          
        else {
          console.log('No user logged in  yet');
          var email = this.model.email;
          // Sending email with sign-in link.
          // [START authwithemail]
          var actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this URL
            // must be whitelisted in the Firebase Console.
            'url':'http://localhost:4200', // Here we redirect back to this same page.
            'handleCodeInApp': true // This must be true.
           };
  
          this._svc.afAuth.auth.sendSignInLinkToEmail(email, actionCodeSettings).then(()=> {
            // Save the email locally so you don’t need to ask the user for it again if they open
            // the link on the same device.
            localStorage.setItem('emailForSignIn', email);
            // The link was successfully sent. Inform the user.
            alert('An email was sent to ' + email + '. Please use the link in the email to sign-in.');
            // [START_EXCLUDE]
            // Re-enable the sign-in button.
            //this.loading = false;
            // [END_EXCLUDE]
          }).catch((error) => {
            // Handle Errors here.
            console.log("ERROR in toggleSignIn: " + error);
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            this.handleError(error);
            // [END_EXCLUDE]
          });
        }
      }, rejected => {
        console.log('No user logged in  yet');
        var email = this.model.email;
        // Sending email with sign-in link.
        // [START authwithemail]
        var actionCodeSettings = {
          // URL you want to redirect back to. The domain (www.example.com) for this URL
          // must be whitelisted in the Firebase Console.
          'url':'http://localhost:4200', // Here we redirect back to this same page.
          'handleCodeInApp': true // This must be true.
         };

        this._svc.afAuth.auth.sendSignInLinkToEmail(email, actionCodeSettings).then(()=> {
          // Save the email locally so you don’t need to ask the user for it again if they open
          // the link on the same device.
          localStorage.setItem('emailForSignIn', email);
          // The link was successfully sent. Inform the user.
          alert('An email was sent to ' + email + '. Please use the link in the email to sign-in.');
          // [START_EXCLUDE]
          // Re-enable the sign-in button.
          //this.loading = false;
          // [END_EXCLUDE]
        }).catch((error) => {
          // Handle Errors here.
          console.log("ERROR in toggleSignIn: " + error);
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          this.handleError(error);
          // [END_EXCLUDE]
        });

      })
      if (this._svc.afAuth.auth.currentUser) {
        // console.log('Current user is ' + this._svc.afAuth.auth.currentUser);
        // // [START signout]
        // this._svc.afAuth.auth.signOut().catch(function(error) {
        //   // Handle Errors here.
        //   var errorCode = error.code;
        //   var errorMessage = error.message;
        //   // [START_EXCLUDE]
        //   this.handleError(error);
          // [END_EXCLUDE]
       // });
       this.router.navigate(['/main']);
        // [END signout]
      } else {
        // console.log('No user logged in  yet');
        // var email = this.model.email;
        // // Sending email with sign-in link.
        // // [START authwithemail]
        // var actionCodeSettings = {
        //   // URL you want to redirect back to. The domain (www.example.com) for this URL
        //   // must be whitelisted in the Firebase Console.
        //   'url':'http://localhost:4200', // Here we redirect back to this same page.
        //   'handleCodeInApp': true // This must be true.
        //  };

        // this._svc.afAuth.auth.sendSignInLinkToEmail(email, actionCodeSettings).then(()=> {
        //   // Save the email locally so you don’t need to ask the user for it again if they open
        //   // the link on the same device.
        //   localStorage.setItem('emailForSignIn', email);
        //   // The link was successfully sent. Inform the user.
        //   alert('An email was sent to ' + email + '. Please use the link in the email to sign-in.');
        //   // [START_EXCLUDE]
        //   // Re-enable the sign-in button.
        //   //this.loading = false;
        //   // [END_EXCLUDE]
        // }).catch((error) => {
        //   // Handle Errors here.
        //   console.log("ERROR in toggleSignIn: " + error);
        //   var errorCode = error.code;
        //   var errorMessage = error.message;
        //   // [START_EXCLUDE]
        //   this.handleError(error);
        //   // [END_EXCLUDE]
        // });
        // [END authwithemail]
      }
    }

    /**
     * Handles Errors from various Promises..
     */
    handleError(error) {
      // Display Error.
      alert('Error: ' + error.message);
      console.log(error);
      // Re-enable the sign-in button.
     // this.loading = false;
    }

    /**
     * Handles automatically signing-in the app if we clicked on the sign-in link in the email.
     */
    handleSignIn(url: string) {
      // [START handlesignin]
      console.log('url is: ' + url);
      if (this._svc.afAuth.auth.currentUser) {
        this.router.navigate(['/main']);
        return;
      }
      if (this._svc.afAuth.auth.isSignInWithEmailLink(url)) {
        // [START_EXCLUDE]
        // Disable the sign-in button during async sign-in tasks.
       // this.loading= true;
        // [END_EXCLUDE]

        // You can also get the other parameters passed in the query string such as state=STATE.
        // Get the email if available.
        var email = localStorage.getItem('emailForSignIn');
        console.log('email is: ' + email);
        // if (!email) {
        //   // User opened the link on a different device. To prevent session fixation attacks, ask the
        //   // user to provide the associated email again. For example:
        //   email = window.prompt('Please provide the email you\'d like to sign-in with for confirmation.');
        // }
        if (email) {
          // The client SDK will parse the code from the link for you.
          this._svc.afAuth.auth.signInWithEmailLink(email, url).then((result) => {
            // Clear the URL to remove the sign-in link parameters.
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
          }).catch((error) => {
            // Handle Errors here.
            console.log("ERROR in handleSigneId user object: " + error);
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            this.handleError(error);
            // [END_EXCLUDE]
          });
        }
      }
      // [END handlesignin]
    }
  
}