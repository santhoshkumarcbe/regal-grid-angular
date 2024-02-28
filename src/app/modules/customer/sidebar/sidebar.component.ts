import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  
  constructor(private router:Router, private auth:AuthService) { }
  ngOnInit(): void {
    this.auth.getData().subscribe((value) => {
      this.isMenuOpen = value;
    })
  }


  profileicon = faCircleUser;
  isMenuOpen:boolean = true;  

  isCustomerpage = this.router.url === '/customer';
  isPaymentpage = this.router.url === '/customer/payment';
  isChatpage = this.router.url === '/customer/chat';

  menuBar(data: boolean) {
    this.isMenuOpen = data;

  }
}
