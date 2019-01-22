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

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  login(): void {
    console.log('Login attempt.....');
    this.storeService.login(this.emailFormControl.value, this.passwordFormControl.value)
      .subscribe(res => {
        console.log('Data retrieved from login route ', res);

        if (res.token) {
          this.router.navigateByUrl('/dashboard');
        } else {
          console.log(res);
          alert(res);
        }
      });
  }

  ngOnInit() {

  }

}
