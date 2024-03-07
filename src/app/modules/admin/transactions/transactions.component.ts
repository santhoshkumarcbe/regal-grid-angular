import { Component } from '@angular/core';
import { chargingStation } from 'src/app/models/chargingStationDistance.model';
import { Slot } from 'src/app/models/slot.model';
import { User } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/admin.service';
import { ChargingStationService } from 'src/app/services/charging-station.service';
import { SlotService } from 'src/app/services/slot.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {

  selectedChargingStation!: chargingStation;
  slots!: Slot[];
  onStationChange() {
    this.slotService.getAllSlotsByChargingStationId(this.selectedChargingStation.id).subscribe({
      next: data => {
        this.slots = data;
      },
      error: error => {
        console.error(error);
      },
      complete: () => {

        this.slots.sort((a: Slot, b: Slot) => {
          if (a.startTime < b.startTime) {
            return -1; // a should come before b
          }
          if (a.startTime > b.startTime) {
            return 1; // a should come after b
          }
          return 0; // a and b are considered equal
        });
        console.log(this.slots);
        this.pagination(this.itemsPerPage);
      }
    })
  }

  itemsPerPage = 10;
  pages!: number;

  pagination(itemsPerPage: number) {
    this.pages = Math.ceil(this.slots.length / itemsPerPage);
    this.displaySlot(1);
  }
  displaySlots!: Slot[];

  displaySlot(pageNumber: number) {
    const startIndex = (pageNumber - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displaySlots = this.slots.slice(startIndex, endIndex);
  }


  constructor(private adminService: AdminService,
    private chargingStationService: ChargingStationService,
    private slotService: SlotService) { }
  users!: User[];
  dealers!: User[];
  ngOnInit() {
    this.adminService.getAllUsers().subscribe({
      next: data => {
        this.users = data;
        console.log(this.users);
        this.filterDealers();

      },
      error: error => {
        console.error(error);
      }
    })


  }

  selectedDealer!: User;
  chargingStations!: chargingStation[];
  onDealerChange(selectedDealer: User) {
    console.log("dealer Name : ", this.selectedDealer);

    this.chargingStationService.getAllChargingStationsByDealerName(selectedDealer.username).subscribe({
      next: data => {
        this.chargingStations = data;
        this.selectedChargingStation = this.chargingStations[0];
        this.onStationChange();
        console.log(data);
      },
      error: error => {
        console.error(error);
      }
    })
  }

  filterDealers() {
    this.dealers = this.users.filter((user: User) => {

      if (user.userRole.includes("dealer")) {
        return true;
      }

      return false;
    });

    console.log(this.dealers);
    this.selectedDealer = this.dealers[0];
    this.onDealerChange(this.selectedDealer);
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
