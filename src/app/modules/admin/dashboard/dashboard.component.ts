import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private adminService: AdminService, private vehicleService: VehicleService, private authService: AuthService) { }

  permissions!: string[];
  users!: any

  isShow = false;
  show() {
    this.isShow = true
  }

  ngOnInit() {
    this.adminService.getAllUsers().subscribe({
      next: users => {
        this.users = users;
        console.log(this.users);
      },
      error: error => {
        alert(error.message);
      },
      complete: () => {
        this.pagination(this.itemsPerPage)
      }
    })

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

  // Open the popup form
  openPopup() {
    const popupForm = document.getElementById("popupForm");
    if (popupForm) {
      popupForm.style.display = "block";
    }
  }

  // Close the popup form
  closePopup() {
    const popupForm = document.getElementById("popupForm");
    if (popupForm) {
      popupForm.style.display = "none";
    }
  }

  username!: string;
  emailId!: string;
  mobileNumber!: number;
  fullName!: string;
  userRole!: string;

  openUserDetails(user: User) {
    this.username = user.username;
    this.emailId = user.emailId;
    this.mobileNumber = user.mobileNumber;
    this.fullName = user.fullName
    this.userRole = user.userRole
    const popup = document.getElementById("popupUserDetails");
    if (popup) {
      popup.style.display = "block";
    }
  }

  closeUserDetails() {
    const popup = document.getElementById("popupUserDetails");
    if (popup) {
      popup.style.display = "none";
    }
  }

  addVehicleForm = new FormGroup({
    vehicleType: new FormControl(),
    vehicleModel: new FormControl(),
    batteryCapacity: new FormControl(),
    chargingTime: new FormControl(),
    chargeDrainPerKm: new FormControl()
  });

  userName = this.authService.getUsername();
  addVehicle() {
    if (this.addVehicleForm.invalid) {
      alert('Please enter valid input');
      return;
    }
    else {
      console.log(this.addVehicleForm.value);
      this.closePopup();
      this.vehicleService.addVehicleBrand(this.addVehicleForm.value).subscribe({
        next: value => {
          console.log("add vehicle response", value);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Vehicle Brand added Successfully",
            showConfirmButton: true,
            timer: 2500
          });
        },
        error: error => {
          console.error(error.error);
          Swal.fire({
            title: error.error,
            showClass: {
              popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
          });
        }
      })
    }

  }

  itemsPerPage = 5;
  pages!: number;

  pagination(itemsPerPage: number) {
    this.pages = Math.ceil(this.users.length / itemsPerPage);
    this.displayUser(1);
  }
  displayUsers!: User[];

  displayUser(pageNumber: number) {
    const startIndex = (pageNumber - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayUsers = this.users.slice(startIndex, endIndex);
  }

}


