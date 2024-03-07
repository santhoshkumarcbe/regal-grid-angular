import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faCheck, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
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
  forgotpasswordStep = 0;
  disableButton = true;
  
  password!:string;
  confirmPassword!:string;

  checkConfirmPassword() {
  if (this.password === this.confirmPassword && this.password !== '' || null || undefined) {
    this.disableButton = false;
    this.updatePassword();
  }
  else{
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

getEmailByUsername(){
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
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a>Why do I have this issue? check your user name</a>'
      });
    }
  })
}

 generateRandomSixDigitNumber(): number {
    const min = 100000; // Minimum value for a 6-digit number
    const max = 999999; // Maximum value for a 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

sendOtpToMail(email:string){
  this.otp = this.generateRandomSixDigitNumber();
  const body: Email = {
    toEmail: email,
    subject: "Forgot Password OTP",
    body: "OTP to reset your password is " + this.otp
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

enteredOtp!:number;
verifyOtp(){
  console.log(this.enteredOtp);
  
  if (this.enteredOtp.toString() === this.otp.toString()) {
    Swal.fire({
      title: "Otp verified successfully !",
      text: "",
      icon: "success"
    });
    this.forgotpasswordStep++;

  }
  else{
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Enter valid otp!",
      footer: '<a></a>'
    });
  }
}




}