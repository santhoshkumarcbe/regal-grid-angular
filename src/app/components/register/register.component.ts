import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faUser, faLock, faVoicemail, faEnvelope, faMobile, faIdBadge, faCheck } from '@fortawesome/free-solid-svg-icons';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { Email } from 'src/app/models/email.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { EmailService } from 'src/app/services/email.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
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
    userRole: new FormControl('customer')
  });

  cannotSubmit = false;

  onSubmit(): void {
    if (this.registerForm.invalid) {
      alert('Please enter valid input');
      return;
    }

    else {
      if (!this.isNewUsername) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "User name already exists! enter unique name",
        });
      }
      else {
        this.cannotSubmit = true;
        this.forgotpasswordStep++;
        const email = this.registerForm.value.emailId;
        this.sendOtpToMail(email!.toString());
      }

    }
  }

  register() {
    this.authService.register(this.registerForm.value).subscribe({
      next: result => {
        console.log(this.registerForm.value);

        console.log(result);

        this._snackBar.open('registered successfully', 'Close', {
          duration: 3000 // 3 seconds
        });

        this.router.navigateByUrl('/');

      },
      error: error => {
        alert(error.message);
        console.error(error);

        this.cannotSubmit = false;
      }
    });
  }

  forgotpasswordStep = 0;
  lockicon = faLock;
  checkicon = faCheck;
  // username!:string;
  isNewUsername: boolean = false;

  findUsername() {
    
    const username = this.registerForm.value.userName
    console.log(username);

    this.authService.isUsernameExists(username).subscribe({
      next: data => {
        this.isNewUsername = !data;
        console.log(data);
        console.log("isNewUsername", this.isNewUsername);

      },
      error: error => {
        console.error(error);
      }
    })


  }


  generateRandomSixDigitNumber(): number {
    const min = 100000; // Minimum value for a 6-digit number
    const max = 999999; // Maximum value for a 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  sendOtpToMail(email: string) {
    this.otp = this.generateRandomSixDigitNumber();
    const body: Email = {
      toEmail: email,
      subject: "Verify Email OTP",
      body: "OTP for Regal-grid register is " + this.otp
    }
    this.emailService.sendEmail(body).subscribe({
      next: data => {
        console.log(data);
      },
      error: error => {
        console.error(error.body);
      }
    })
  }

  otp!: number;
  enteredOtp!: number;
  verifyOtp() {
    console.log(this.enteredOtp);

    if (this.enteredOtp.toString() === this.otp.toString()) {
      Swal.fire({
        title: "Regal grid",
        text: "Registeration successfull !",
        icon: "success",
        footer: '<a> Happy motoring !</a>'
      });
      this.register();
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Enter valid otp!",
        footer: '<a></a>'
      });
    }
  }

}
