import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleUser, faSignOut, faBars, faWallet } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone:true,
  imports:[
    FontAwesomeModule,
    CommonModule
  ]
})
export class HeaderComponent implements OnInit{
  isopen:boolean = true;
  constructor(private auth: AuthService, private router: Router, private paymentService:PaymentService) { }

  subscription! : Subscription

  ngOnInit() {
    if (this.isloginpage) {
      this.logout();
    }
    else{
    this.subscription= this.auth.amountString.subscribe(
      {
        next: amount => {
          console.log("wallet balance ", amount);
          this.walletAmount = amount;
          const balance = this.walletAmount === null ? 0: parseFloat(this.walletAmount.replace(",",""));
          this.paymentService.setWalletBalance(balance);
        },
        error: error => {
          console.error(error.message);
        }
      }
    );
  }
  }

  walletAmount!:string | null;
  logged = this.auth.isLoggedIn();
  username = this.auth.getUsername();

  profileicon = faCircleUser;
  logouticon = faSignOut;
  menuicon = faBars;
  walleticon = faWallet;

  isloginpage = this.router.url === '/' || this.router.url === '/register' || this.router.url === '/forgot-password';

  openMenu() {
      this.isopen = !this.isopen;
      this.auth.setData(this.isopen);
  }

  topUpWallet(){
    this.router.navigateByUrl('/customer/payment')
  }

  logout() {
    this.auth.logout();
    localStorage.clear();
    clearTimeout(this.auth.sessionTime);
    console.log("interval cleared");
  }

  logoutClick(){
    // this.subscription.unsubscribe();
    this.logout();
    this.router.navigate(['']);
  }
}
