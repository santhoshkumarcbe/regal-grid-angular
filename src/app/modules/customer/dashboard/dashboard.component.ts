import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Slot } from 'src/app/models/slot.model';
import { AuthService } from 'src/app/services/auth.service';
import { SlotService } from 'src/app/services/slot.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private slotService: SlotService, private datePipe: DatePipe) { }
  slots!: Slot[];
  minDate: string = new Date().toISOString().split('T')[0];
  minTime: string = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  ngOnInit(): void {
    console.log("this.minTime", this.minTime);
     console.log("this.minDate", this.minDate);
    
    const date = new Date(); 
    this.getAllSlotsByDate(date);
    
  }

  getAllSlotsByDate(date:Date){
    this.slotService.getAllSlotsByDate(date).subscribe(
      {
        next: slots => {
          this.slots = slots;
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

  selectedDate!: string;
  selectedTime!: string;
  specificSlots!:Slot[];
  getSlotsForDate() {
    if (this.selectedDate && this.selectedTime) {
      const dateTimeString = `${this.selectedDate}T${this.selectedTime}`;
      console.log("dateTimeString", dateTimeString);
      const dateTime = new Date(dateTimeString);
      this.slotService.getAllSlotsByDate(dateTime).subscribe(
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
    } else {
      Swal.fire('Date and time are required');
      console.error('Date and time are required');
    }
  }

  calculateEndTime(startTime: string, duration: string): string | null {
    const start = new Date(startTime);
    const durationParts = duration.split('T')[1].split(/[HMS]/);
    console.log("durationParts", durationParts);

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (duration.includes('H')) {
      hours = parseInt(durationParts[0]);
    }

    if (duration.includes('M')) {
      if (duration.includes('H')) {
        minutes = parseInt(durationParts[1]);
      } else {
        minutes = parseInt(durationParts[0]);
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


    let endTime: any = new Date(start.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000);
    endTime = endTime.toString(); // You can format the date as required
    console.log("endTime", endTime);

    return this.datePipe.transform(endTime, 'medium', 'IST');
  }

  getISTTime(time: string): string | null {
    // Convert UTC time to IST
    const startTime = new Date(time);
    return this.datePipe.transform(startTime, 'medium', 'IST');
  }

}
