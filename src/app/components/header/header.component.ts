import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleUser, faSignOut, faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.isloginpage) {
      this.logout();
    }
  }
  logged = this.auth.isLoggedIn();
  username = this.auth.getUsername();

  profileicon = faCircleUser;
  logouticon = faSignOut;
  menuicon = faBars;


  isloginpage = this.router.url === '/';

  openMenu() {
      this.isopen = !this.isopen;
      this.auth.setData(this.isopen);
  }

  logout() {
    this.auth.logout();
    localStorage.clear();
    clearTimeout(this.auth.sessionTime);
    console.log("interval cleared");

  }

}
