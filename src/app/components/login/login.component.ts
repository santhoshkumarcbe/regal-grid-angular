import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private _snackBar: MatSnackBar, private auth: AuthService, private router: Router, private guard: AuthGuard) { }
  usericon = faUser;
  passwordicon = faLock;
  user!: User;
  userId!: number;
  token = '';
  loginForm = new FormGroup({
    userName: new FormControl('customer1'),
    password: new FormControl('rg')
  });

  cannotSubmit = false;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      alert('Please enter valid input');
      return;
    }

    else {
      this.cannotSubmit = true;
      this.auth.authenticate(this.loginForm.value).subscribe(
        (result) => {
          this.guard.canActivate(true);
          this.auth.clearLocalStorageAfterTime(1000 * 60 * 60 * 24);
          console.log(result);
          console.log(result.token);
          console.log(result.user);
          this.user = result.user;
          console.log(result.user.userId);
          this.userId = result.user.userId;
          console.log("userid", this.userId);
          this.auth.setUser(this.user);
          localStorage.setItem('userId', JSON.stringify(this.user.userId));
          this.auth.setUsername(result.user.username);
          console.log(result.user.username);

          localStorage.setItem('token', result.token);

          this.auth.setToken(result.token);
          this._snackBar.open('Login successful', 'Close', {
            duration: 3000 // 3 seconds
          });

          if (result.user.userRole === 'customer') {
            this.router.navigateByUrl('/customer');
          }
          else if (result.user.userRole === 'admin') {
            this.router.navigateByUrl('/admin');
          }
        },
        (err: Error) => {
          alert(err.message);
          this.cannotSubmit = false;
        }
      );
    }

  }

}
