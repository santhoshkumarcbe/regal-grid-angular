import { Component } from '@angular/core';
import { chargingStation } from 'src/app/models/chargingStationDistance.model';
import { Slot } from 'src/app/models/slot.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChargingStationService } from 'src/app/services/charging-station.service';
import { SlotService } from 'src/app/services/slot.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})

export class TransactionsComponent {

searchText!: string;

search(text: string) {
this.searchText = text.toString();

if (this.searchText === '') {
  this.displaySlots = this.slots;
  this.pagination(10);
}
this.displaySlots = this.slots.filter((slot: Slot) => {

  if (slot.startTime.includes(this.searchText)) {
      return true;
  }
  
  return false;
});

this.pagination(10);
  
}
  itemsPerPage = 10;
  pages!:number;
  
pagination(itemsPerPage: number){
  this.pages = Math.ceil(this.slots.length / itemsPerPage);
  this.displaySlot(1);
}
displaySlots!:Slot[];

displaySlot(pageNumber:number){
  const startIndex = (pageNumber - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displaySlots = this.slots.slice(startIndex, endIndex);
}




onSelectionChanges(chargingStation: chargingStation) {
  this.selectedChargingStation = chargingStation;
  this.slotService.getAllSlotsByChargingStationId(this.selectedChargingStation.id).subscribe({
    next: data => {
      this.slots = data;
      this.pagination(this.itemsPerPage);
    },
    error: error => {
      console.error(error);
    },
    complete: () => {

      this.slots.sort((a, b) => {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });
      console.log(this.slots);
    }
  })
}

  constructor(private slotService: SlotService,
    private chargingStationService: ChargingStationService,
    private authService: AuthService) { }

  chargingStations!: chargingStation[];
  slots!: Slot[];
  selectedChargingStation!: chargingStation;
  ngOnInit() {
    this.getAllChargingStations();
  }

  getAllChargingStations() {
    const userName = this.authService.getUsername();
    const dealerName = userName === null ? '' : userName;
    this.chargingStationService.getAllChargingStationsByDealerName(dealerName).subscribe({
      next: stations => {
        this.chargingStations = stations;
        console.log(this.chargingStations);
        this.selectedChargingStation = this.chargingStations[0];
        this.onSelectionChanges(this.selectedChargingStation);
        console.log(this.selectedChargingStation);
        
      },
      error: error => {
        console.error(error);
      }
    })



  }

  hours = 0;
  minutes = 0;
  startTime!:Date
  endTime!:Date;
  endTimeStr!: string;
  getHoursAndMinutesFromDuration(slot: Slot) {
    const duration = slot.duration;
    this.startTime = new Date(slot.startTime);
    const durationParts = duration.split('T')[1].split(/[HMS]/);


    let seconds = 0;

    if (duration.includes('H')) {
      this.hours = parseInt(durationParts[0]);
    }

    if (duration.includes('M')) {
      if (duration.includes('H')) {
        this.minutes = parseInt(durationParts[1]);
      } else {
        this.minutes = parseInt(durationParts[0]);
      }
    }

    if (duration.includes('S')) {
      if (duration.includes('H') && duration.includes('M')) {
        seconds = parseInt(durationParts[2]);
      } else if (duration.includes('M') && !duration.includes('H') || duration.includes('M') && !duration.includes('H')) {
        seconds = parseInt(durationParts[1]);
      } else {
        seconds = parseInt(durationParts[0]);
        console.log("seconds", seconds);
      }
    }

    // return `${this.hours} hours : ${this.minutes} minutes`; 
    
    this.endTime = new Date(this.startTime.getTime() + this.hours * 60 * 60 * 1000 + this.minutes * 60 * 1000);
    this.endTimeStr = `${this.endTime.getFullYear()}-${this.endTime.getMonth() < 10 ? `0${this.endTime.getMonth()}`: this.endTime.getMonth()}-${
      this.endTime.getDate() < 10 ? `0${this.endTime.getDate()}`: this.endTime.getDate()}T${
        this.endTime.getHours() < 10 ? `0${this.endTime.getHours()}`: this.endTime.getHours()}:${
          this.endTime.getMinutes() < 10 ? `0${this.endTime.getMinutes()}`: this.endTime.getMinutes()}:${
            this.endTime.getSeconds() < 10 ? `0${this.endTime.getSeconds()}`: this.endTime.getSeconds()
          }`
  }

  getAmount(chargingStationId: string) {
    let chargingStation:chargingStation[];
    chargingStation = this.chargingStations.filter((station) => station.id === chargingStationId);
    let totalMinutes = this.hours * 60;
    totalMinutes += this.minutes;
    const amount = totalMinutes * chargingStation[0].costPerMinute;
    const amountAfterFee = amount * 0.90;
    return Number(amountAfterFee.toFixed(2));
  }
}
