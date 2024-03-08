import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SlotService } from 'src/app/services/slot.service';
import Swal from 'sweetalert2';
import { chargingStation, chargingStationDistance } from 'src/app/models/chargingStationDistance.model';
import { VehicleService } from 'src/app/services/vehicle.service';
import { UserVehicle, Vehicle, VehicleModel } from 'src/app/models/vehicle.model';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ChargingStationService } from 'src/app/services/charging-station.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  ngOnInit(): void {
    this.getUserVehicle();
    if (this.router.url === '/customer') {
      this.slotService.isGetSlotsClicked = false;
    }

    if (this.userVehicles) {
      this.selectedUserVehicle = this.userVehicles[0];
    }
  }

  getExpectedCharge() {
    let seconds = 0;
    seconds += this.expectedChargeHour * 60 * 60;
    seconds += this.expectedChargeMinutes * 60;
    this.vehicleService.getExpectedCharge(this.selectedUserVehicle.vehiclemodel, this.selectedUserVehicle.chargeAvailable, seconds).subscribe({
      next: data => {
        if (data <= 100) {
          this.expectedCharge = data;
        }
        else {
          Swal.fire('Enter less time');
        }
      },
      error: error => {
        console.error(error);
      }
    })
  }

  onSelectionChange(event: UserVehicle) {
    this.selectedUserVehicle = event;
    console.log(this.selectedUserVehicle);
    this.getExpectedTimeDuration();
    this.getAllChargingStations();
  }

  getExpectedTimeDuration() {
    let seconds;
    this.vehicleService.getExpectedTimeDuration(this.selectedUserVehicle.vehiclemodel, this.selectedUserVehicle.chargeAvailable, this.expectedCharge).subscribe({
      next: time => {
        console.log("expected time", time);

        seconds = time;
        this.expectedChargeHour = Math.floor(seconds / (60 * 60));
        this.expectedChargeMinutes = Math.floor((seconds % (60 * 60)) / (60));
        this.vehicleService.setExpectedChargeTime(this.expectedChargeHour, this.expectedChargeMinutes);
      },
      error: error => {
        console.error(error);
      }
    })
  }

  expectedCharge: number = 100;
  expectedChargeHour!: number;
  expectedChargeMinutes!: number;

  constructor(private slotService: SlotService,
    private router: Router,
    private vehicleService: VehicleService,
    private authService: AuthService,
    private chargingStationService: ChargingStationService) { }


  chargingStationDistances!: chargingStationDistance[];


  vehicle!: Vehicle;
  userVehicles!: UserVehicle[];
  vehicleModels!: VehicleModel[];
  userName = this.authService.getUsername();
  selectedUserVehicle!: UserVehicle

  getUserVehicle() {
    if (this.userName != null) {
      this.vehicleService.getVehicle(this.userName.toString()).subscribe({
        next: data => {
          this.vehicle = data;
          this.vehicleModels = data.vehicleModel;
          this.userVehicles = data.userVehicle;
          this.selectedUserVehicle = this.userVehicles[0];
          console.log(this.vehicleModels);
          console.log(this.userVehicles);

          console.log(this.vehicle);

          if (this.userVehicles.length !== 0) {
            this.getAllChargingStations();
            this.getExpectedTimeDuration();
          }


        },
        error: error => {
          console.error(error.message);

        }
      });
    }
    else {
      console.error("userName is null");

    }
  }

  addVehicleForm = new FormGroup({
    vehicleName: new FormControl(),
    vehiclemodel: new FormControl(),
    chargeAvailable: new FormControl(55),
    location: new FormControl('18.88,64.63')
  });

  addVehicle() {
    if (this.addVehicleForm.invalid) {
      alert('Please enter valid input');
      return;
    }
    else {
      console.log(this.addVehicleForm.value);

      this.vehicleService.addVehicle(this.addVehicleForm.value, this.userName!.toString()).subscribe({
        next: value => {
          console.log("add vehicle response", value);
          this.closePopup();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Vehicle added Successfully",
            showConfirmButton: true,
            timer: 1500
          });
          this.getUserVehicle();
        },
        error: error => {
          console.error(error.message);
        }
      })
    }

  }

  userLatitude!: number;
  userLongitude!: number;

  getAllChargingStations() {
    if (this.selectedUserVehicle !== undefined) {

      const coordinatesArray: string[] = this.selectedUserVehicle.location.split(',');
      let latitude;
      let longitude;
      if (coordinatesArray.length === 2) {
        this.userLatitude = parseFloat(coordinatesArray[0]);
        this.userLongitude = parseFloat(coordinatesArray[1]);

        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
      } else {
        console.error('Invalid coordinates string format');
      }

      this.chargingStationService.getAllChargingStations(this.userLatitude, this.userLongitude).subscribe(
        {
          next: chargingstationDistance => {
            this.chargingStationDistances = chargingstationDistance
            console.log("chargingstationDistance", chargingstationDistance);
          },
          error: error => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
            console.error(error.message);
          }
        }
      )
    }
  }

  getSlots(chargingStation: chargingStation) {
    this.chargingStationService.setDealerName(chargingStation.dealerName);
    this.slotService.setChargingStationId(chargingStation.id);
    this.slotService.setChargingStationName(chargingStation.stationName);
    this.slotService.setCostPerMinute(chargingStation.costPerMinute);
    this.router.navigateByUrl('customer/slots')
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

}
