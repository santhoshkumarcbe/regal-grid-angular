import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Slot } from 'src/app/models/slot.model';
import { SlotService } from 'src/app/services/slot.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss']
})
export class SlotComponent implements OnInit {
  constructor(private slotService: SlotService, private datePipe: DatePipe, private router: Router) { }
  chargingStationId!: string | null;
  slots!: Slot[] ;
  minDate: string = new Date().toISOString().split('T')[0];
  minTime: string = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  private subscription!: Subscription;

  ngOnInit(): void {
    this.chargingStationId = this.slotService.getChargingStationId();
    const date = new Date();
    const millis = date.getHours() * 60 * 60 * 1000 + date.getMinutes() * 60 * 1000 + date.getSeconds() * 1000;
    date.setTime(date.getTime() - millis);
    this.getAllSlotsByDate(this.chargingStationId, date);
    if (this.selectedDate!==null && this.slotService.isGetSlotsClicked) {
    this.getSlotsForDate();
    }
    if (this.specificSlots) {
      this.selectedDate = this.specificSlots[0].date.toLocaleDateString();
      this.selectedTime = this.specificSlots[0].date.toLocaleTimeString()
    }
  }

  private destroy$: Subject<void> = new Subject<void>();
  ngOnDestroy() {
    this.destroy$.next(); // Emit signal to unsubscribe
      this.destroy$.complete();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  bookSlot(){
    this.router.navigateByUrl('customer/bookslots');
  }

  getAllSlotsByDate(id: string| null, date: Date) {
    // if (this.selectedDate!==null) {
       this.slotService.getAllSlotsByDate(id, date).subscribe(
        {
          next: slots => {
            this.slots = slots;
            console.log(slots);
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
    // }
  }

  selectedDate = localStorage.getItem('selectedDate');
  selectedTime = localStorage.getItem('selectedTime');
  specificSlots!: Slot[];

  getAllSlot() {
    this.slotService.getAllSlot().subscribe(
      {
        next: slots => {
          this.specificSlots = slots;
          console.log(this.slots);
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

  getSlotsForDate() {
    if (this.selectedDate && this.selectedTime) {
      localStorage.setItem('selectedDate', this.selectedDate);
      localStorage.setItem('selectedTime', this.selectedTime);
      const dateTimeString = `${this.selectedDate}T${this.selectedTime}`;
      console.log("dateTimeString", dateTimeString);
      const dateTime = new Date(dateTimeString);
      this.slotService.fetchAllSlot(this.chargingStationId, dateTime);
      this.getAllSlot();
    } else {
      Swal.fire('Date and time are required');
      console.error('Date and time are required');
    }
  }

  calculateEndTime(startTime: string, duration: string): string | null {
    return this.slotService.calculateEndTime(startTime, duration);
    
  }

  getISTTime(time: string): string | null {
    return this.slotService.getISTTime(time);
  }

}