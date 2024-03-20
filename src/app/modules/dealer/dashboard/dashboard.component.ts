import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { chargingStation } from 'src/app/models/chargingStationDistance.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChargingStationService } from 'src/app/services/charging-station.service';
import { SlotService } from 'src/app/services/slot.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  chargingStations!:chargingStation[];

  constructor(private chargingStationService: ChargingStationService,
    private authService: AuthService,
    private router: Router,
    private slotService : SlotService
    ) {}

  ngOnInit(){
    this.getAllChargingStations();
  }
  
  getAllChargingStations(){
    const userName = this.authService.getUsername();
    const dealerName = userName === null ? '':userName;
    console.log("dealername", dealerName);
    
    this.chargingStationService.getAllChargingStationsByDealerName(dealerName).subscribe({
      next: data => {
        this.chargingStations = data;
        console.log(data);
      },
      error: error => {
        console.error(error);
      }
    })
    
  }

  getSlots(id: string, name: string, costPerMinute: number) {
    this.slotService.setChargingStationId(id);
    this.slotService.setChargingStationName(name);
    this.slotService.setCostPerMinute(costPerMinute);
    this.router.navigateByUrl('dealer/slots')
  }

  addChargingStationForm = new FormGroup({
    id: new FormControl(null),
    dealerName: new FormControl(localStorage.getItem('username')),
    stationName: new FormControl(),
    stationtype: new FormControl(),
    costPerMinute: new FormControl(),
    location: new FormControl('18.89,62.63')
  });

  vehicleTypes = ['two wheeler', 'three wheeler', 'four wheeler', 'heavy vehicle']

  addChargingStation() {
    if (this.addChargingStationForm.invalid) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter valid input",
        confirmButtonColor: '#007bff'
      });
      return;
    }
    else {
      console.log(this.addChargingStationForm.value);

      this.chargingStationService.postChargingStation(this.addChargingStationForm.value).subscribe({
        next: value => {
          console.log("add charging station response", value);
          this.closePopup();
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Charging Station added Successfully",
            confirmButtonColor: '#007bff',
            showConfirmButton: true,
            timer: 1500
          });
          this.getAllChargingStations();
        },
        error: error => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.error,
            confirmButtonColor: '#007bff'
          });
        }
      })
    }

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
