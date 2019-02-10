import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { StoreService } from '../services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private storeService: StoreService,
    private router: Router
  ) { }

  panelOpenState = false;
  hide = true;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  nameFormControl = new FormControl('', [
    Validators.required
  ]);

  verifyToken():void {
    this.storeService.verifyToken()
      .subscribe(res => {
        console.log('Data retrieved from login route ', res);

        if (res.token) {
          this.router.navigateByUrl('/dashboard');
        } else {
          console.log(res);
        }
      });
  }

  login(): void {
    console.log('Login attempt.....');
    this.storeService.login(this.emailFormControl.value, this.passwordFormControl.value)
      .subscribe(res => {
        if (res.token) {
          this.router.navigateByUrl('/dashboard');
        } else {
          console.log(res);
        }
      });
  }

  signup(): void {
    console.log('Sign Up attempt.....');
    this.storeService.signup(this.nameFormControl.value, this.emailFormControl.value, this.passwordFormControl.value)
      .subscribe(res => {
        console.log('Data retrieved from Sign Up route ', res);

        if (res && res.token) {
          this.router.navigateByUrl('/dashboard');
        } else {
          console.log(res);
        }
      });
  }


  ngOnInit() {
    this.verifyToken();
  }

}
