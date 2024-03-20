import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faUser, faLock, faEnvelope, faMobile, faIdBadge, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { Email } from 'src/app/models/email.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { EmailService } from 'src/app/services/email.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-dealer',
  templateUrl: './register-dealer.component.html',
  styleUrls: ['./register-dealer.component.scss']
})
export class RegisterDealerComponent {
  constructor(private _snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private emailService: EmailService,
    private guard: AuthGuard) { }

  usericon = faUser;
  passwordicon = faLock;
  emailicon = faEnvelope;
  mobileicon = faMobile;
  fullnameicon = faIdBadge;

  user!: User;
  userId!: number;
  token = '';
  registerForm = new FormGroup({
    userName: new FormControl(''),
    passwordHash: new FormControl(''),
    emailId: new FormControl(''),
    mobileNumber: new FormControl(''),
    fullName: new FormControl(''),
    userRole: new FormControl('dealer')
  });

  cannotSubmit = false;
  isEmailExist = false;
  isMobileNumberExist = false;

  ngOnInit(){
    this.registerForm.statusChanges.subscribe({
      next: data => {
        console.log(data);
        this.cannotSubmit = false;
      },
      error: error => {
        console.log(error);
        
      }
    })
  }

  onSubmit(): void {
      if (!this.isNewUsername) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "User name already exists! enter unique name",
          confirmButtonColor: '#007bff'
        });
      }

      else {
        this.cannotSubmit = true;
        this.register();
      }
  }

  checkFormVaild(){
    if (this.registerForm.invalid) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter valid input",
        confirmButtonColor: '#007bff'
      });
    }
    else{
      this.checkEmailExist()
    }
  }

  checkEmailExist() {
    this.authService.isEmailExists(this.registerForm.value.emailId).subscribe({
      next: value => {
        this.isEmailExist = value;
      },
      error: error => {
        console.error(error);
      },
      complete: () => {
        if (this.isEmailExist) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Email id already exist",
            confirmButtonColor: '#007bff'
          });
        }
        else {
          this.checkMobileNumberExist();
        }
      }
    })

  }

  checkMobileNumberExist() {
    this.authService.isMobileNumberExists(this.registerForm.value.mobileNumber).subscribe({
      next: value => {
        this.isMobileNumberExist = value;
        
      },
      error: error => {
        console.error(error);
      }
      ,
      complete: () => {
        if (this.isMobileNumberExist) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Mobile number already exist",
            confirmButtonColor: '#007bff'
          });
        }
        else{
          this.onSubmit();
        }
      }
    })
  }

  register() {
    this.authService.register(this.registerForm.value).subscribe({
      next: result => {
        console.log(this.registerForm.value);

        console.log(result);

        Swal.fire({
          title: "Good job!",
          text: "Dealer registered successfully !",
          icon: "success",
          confirmButtonColor: '#007bff'
        });

      },
      error: error => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
          confirmButtonColor: '#007bff'
        });
        console.error(error);

        this.cannotSubmit = false;
      }
    });
  }

  forgotpasswordStep = 0;
  lockicon = faLock;
  checkicon = faCheck;
  wrongicon = faXmark;
  isNewUsername: boolean = false;
  isUsernameNull = true;

  findUsername() {
    const username = this.registerForm.value.userName
    if (username === '') {
      this.isNewUsername = false;
      this.isUsernameNull = true;
    }
    else {
      this.authService.isUsernameExists(username).subscribe({
        next: data => {
          this.isNewUsername = !data;
          this.isUsernameNull = false;
        },
        error: error => {
          console.error(error);
        }
      })
    }




  }

}
