import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { chargingStation } from 'src/app/models/chargingStationDistance.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChargingStationService } from 'src/app/services/charging-station.service';
import { SlotService } from 'src/app/services/slot.service';

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

}
