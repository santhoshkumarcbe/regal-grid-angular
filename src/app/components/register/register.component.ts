import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faUser, faLock, faVoicemail, faEnvelope, faMobile, faIdBadge, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
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
  isEmailExist = false;
  isMobileNumberExist = false;

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
        this.forgotpasswordStep++;
        const email = this.registerForm.value.emailId;
        this.sendOtpToMail(email!.toString());
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
            text: "Email id already exist, please log in",
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
            text: "Mobile number already exist, please log in",
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

        this._snackBar.open('registered successfully', 'Close', {
          duration: 3000 // 3 seconds
        });

        this.router.navigateByUrl('/');

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
          // console.log(data);
        },
        error: error => {
          console.error(error);
        }
      })
    }




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
      // body: "OTP for Regal-grid register is " + this.otp
      body: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: #333;">Your OTP for Regal-grid Registration</h2>
        <p style="text-align: center; color: #666;">Please use the following OTP to complete your registration:</p>
        <div style="background-color: #f9f9f9; padding: 10px; text-align: center; font-size: 24px; margin-bottom: 20px;">
          <strong style="color: #333;">${this.otp}</strong>
        </div>
        <p style="text-align: center; color: #666;">This OTP is valid for a limited time. Please do not share it with anyone.</p>
        <img src="cid:logo" alt="Regal-grid logo" style="max-width: 50%; height: 50%; display: block; margin: 20px auto;"> 
      </div>
      
      </body>`
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
        footer: '<a> Happy motoring !</a>',
        confirmButtonColor: '#007bff'
      });
      this.register();
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Enter valid otp!",
        confirmButtonColor: '#007bff'
      });
    }
  }

}
