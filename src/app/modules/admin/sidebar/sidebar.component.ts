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

  isDashboardpage = this.router.url === '/admin';
  isTransactionpage = this.router.url === '/admin/transactions';
  isRegisterDealerPage = this.router.url === '/admin/register-dealer';

  menuBar(data: boolean) {
    this.isMenuOpen = data;

  }
}
