import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private adminService: AdminService) { }

  permissions!: string[];
  users!: any

  isShow = false;
  show() {
    this.isShow = true
  }

  ngOnInit() {
    this.adminService.getAllUsers().subscribe((users: any) => {
      this.users = users;
      console.log(this.users);
    }, (error: Error) => {
      alert(error.message);
    });

    this.adminService.getAuthorities().subscribe((authorities: any) => {
      console.log(authorities);
      this.permissions = authorities[0].admin
      console.log("permissions", this.permissions);

    }, (error: Error) => {
      alert(error.message);
    });
  }

  isChecked(authorities: any, permission: any) {
    if (authorities.includes(permission)) {
      return true;
    }
    return false;
  }

}


