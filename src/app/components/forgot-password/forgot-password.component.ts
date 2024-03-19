import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faCheck, faLock, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Email } from 'src/app/models/email.model';
import { AuthService } from 'src/app/services/auth.service';
import { EmailService } from 'src/app/services/email.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  constructor(private authService: AuthService, private emailService: EmailService, private router: Router) { }

  username!: string;
  otp!: number;
  lockicon = faLock;
  usericon = faUser;
  checkicon = faCheck;
  wrongicon = faXmark;
  forgotpasswordStep = 0;
  disableButton = true;

  password!: string;
  confirmPassword!: string;
  isUsernameNull = true;

  checkConfirmPass(){
    if(this.confirmPassword === null || '' || undefined){
      this.disableButton = true;
      this.isUsernameNull = true;   
      return false;
    }
    else if (this.password === this.confirmPassword && this.password !== '' || null || undefined) {
      this.isUsernameNull = false;
      this.disableButton = false;
      return true;
    }
    else{
      this.disableButton = true;
      // this.isUsernameNull = true;
      return false;
    }
  }

  checkConfirmPassword() {
    if (this.checkConfirmPass()) {
      this.disableButton = false;
      this.updatePassword();
    }
    else {
      this.disableButton = true;
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password and confirm password should be same",
      });
    }
  }

  updatePassword() {
    this.authService.updatePassword(this.username, this.password).subscribe({
      next: data => {
        console.log(data);
        Swal.fire({
          title: "Good job!",
          text: "Password updated!",
          icon: "success"
        });
        this.router.navigateByUrl('/');
      },
      error: error => {
        console.error(error);

      }
    })
  }

  getEmailByUsername() {
    this.authService.getEmailByUserName(this.username).subscribe({
      next: email => {
        console.log(email);
        this.sendOtpToMail(email);
        Swal.fire("OTP send to your registered e-mail");
        this.forgotpasswordStep++;
      },
      error: error => {
        console.error(error);

        Swal.fire({
          icon: "error",
          title: "User name not found",
          text: "Enter valid user name",
        });
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
      subject: "Forgot Password OTP",
      body: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="text-align: center; color: #333;">Password Reset OTP</h2>
      <p style="text-align: center; color: #666;">Your OTP to reset your password is:</p>
      <div style="background-color: #f9f9f9; padding: 10px; text-align: center; font-size: 24px; margin-bottom: 20px;">
        <strong style="color: #333;">${this.otp}</strong>
      </div>
      <p style="text-align: center; color: #666;">Please use this OTP to reset your password. This OTP is valid for a limited time and should not be shared with anyone.</p>
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

  enteredOtp!: number;
  verifyOtp() {
    console.log(this.enteredOtp);

    if (this.enteredOtp.toString() === this.otp.toString()) {
      Swal.fire({
        title: "Otp verified successfully !",
        text: "",
        icon: "success"
      });
      this.forgotpasswordStep++;

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
