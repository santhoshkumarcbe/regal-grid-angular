import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

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
    userName: new FormControl(''),
    password: new FormControl('')
  });

  cannotSubmit = false;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter valid input !",
        confirmButtonColor: '#007bff'
      });
      return;
    }

    else {
      this.cannotSubmit = true;
      this.auth.authenticate(this.loginForm.value).subscribe(
        (result) => {
          console.log(this.loginForm.value);
          
          this.guard.canActivate(true);
          this.auth.clearLocalStorageAfterTime(1000 * 60 * 60 * 24);

          console.log(result);

          this.user = result.user;
          this.userId = result.user.userId;
          this.auth.setUser(this.user);
          this.auth.setEmail(this.user.emailId);
          localStorage.setItem('userId', JSON.stringify(this.user.userId));
          this.auth.setUsername(result.user.username);
          console.log(result.user.username);

          localStorage.setItem('token', result.token);

          this.auth.setToken(result.token);
          this.auth.setWalletAmount(result.user.wallet)

          this._snackBar.open('Login successful', 'Close', {
            duration: 3000 // 3 seconds
          });

          if (result.user.userRole === 'customer') {
            this.router.navigateByUrl('/customer');
          }
          else if (result.user.userRole === 'admin') {
            this.router.navigateByUrl('/admin');
          }
          else if (result.user.userRole === 'dealer') {
            this.router.navigateByUrl('/dealer');
          }
        },
        (err: Error) => {
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a>Check username and password</a>',
            confirmButtonColor: '#007bff'
          });
          
          this.cannotSubmit = false;
        }
      );
    }

  }

}
