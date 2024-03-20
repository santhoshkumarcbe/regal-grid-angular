import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Slot } from 'src/app/models/slot.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChargingStationService } from 'src/app/services/charging-station.service';
import { EmailService } from 'src/app/services/email.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SlotService } from 'src/app/services/slot.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-slot',
  templateUrl: './book-slot.component.html',
  styleUrls: ['./book-slot.component.scss']
})
export class BookSlotComponent {
  constructor(private slotService: SlotService,
    private vehicleService: VehicleService,
    private emailService: EmailService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private router: Router,
    private chargingStationService: ChargingStationService
  ) { }

  fromTimeChanges() {
    this.getToTime();
  }

  fromDateChange() {
    this.getToTime();
  }

  getToTime() {
    if (this.fromDate && this.fromTime) {
      const startTimeStr = `${this.fromDate}T${this.fromTime}`;
      const startTime = new Date(startTimeStr);
      const endTime = new Date(startTimeStr);
      const hours = this.vehicleService.getExpectedChargeHour();
      const minutes = this.vehicleService.getExpectedChargeMinutes();
      endTime.setHours(endTime.getHours() + hours);
      endTime.setMinutes(endTime.getMinutes() + minutes);
      console.log(hours);
      console.log(minutes);
      this.hours = hours;
      this.minutes = minutes;
      this.toTime = `${endTime.getHours() < 10 ? `0${endTime.getHours()}` : endTime.getHours()}:${endTime.getMinutes() < 10 ? `0${endTime.getMinutes()}` : endTime.getMinutes()}`

    }
  }

  minDate: string = new Date().toISOString().split('T')[0];
  minTime: string = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  fromDate!: string;
  fromTime!: string;

  // toDate!: string;
  toTime!: string;

  private subscription!: Subscription;

  ngOnInit() {
    if (this.selectedDate !== null && this.slotService.isGetSlotsClicked) {
      this.getAllSlots()
    }
  }

  getAllSlots() {
    this.subscription = this.slotService.getAllSlot().subscribe(
      {
        next: slots => {
          this.specificSlots = slots;
          console.log(slots);
        },
        error: error => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            confirmButtonColor: '#007bff'
          });
          console.error(error.message);
        }
      }
    )

  }

  private destroy$: Subject<void> = new Subject<void>();
  ngOnDestroy() {
    this.destroy$.next(); // Emit signal to unsubscribe
    this.destroy$.complete();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  bookSlotClicked() {
    const startTimeStr = `${this.fromDate}T${this.fromTime}`;
    const endTimeStr = `${this.fromDate}T${this.toTime}`;
    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);
    const duration = this.getDuration(startTime, endTime);
    let totalMinutes = this.minutes;
    totalMinutes += this.hours * 60;
    const cost = this.slotService.getCostPerMinute();
    const totalCost = cost * totalMinutes;
    const currentDate = new Date();
    console.log(totalCost);

    if (currentDate > startTime) {
      Swal.fire({
        title: "Start Time should be greater than current Time",
        confirmButtonColor: '#007bff',
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
    else if (!duration) {
      Swal.fire({
        title: "slot duration should minimum 5 minutes",
        confirmButtonColor: '#007bff',
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
    else if (!this.fromDate && !this.fromTime && !this.toTime) {
      Swal.fire({
        text: 'Slot timing required',
        confirmButtonColor: '#007bff'
      });
    }

    else {
      Swal.fire({
        title: "This slot costs you ₹" + totalCost + ", Do you like to book slot ?",
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: "Yes, book slot",
        confirmButtonColor: '#007bff',
        denyButtonText: `cancel`
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("total cost", totalCost);

          this.checkAvailableBalance(totalCost);
        }
        else if (result.isDenied) {
          Swal.fire({
            text: "Slot canceled",
            icon: "info",
            confirmButtonColor: '#007bff'
          });
        }
      });
    }

  }

  checkAvailableBalance(deductionAmount: number) {
    let walletBalance = this.paymentService.getWalletBalance();
    console.log("wallet balance", walletBalance);

    walletBalance -= deductionAmount;
    console.log("wallet balance after deduction", walletBalance);

    if (walletBalance < 0) {
      Swal.fire({
        title: "Your wallet has low balance, Do you like pay now ?",
        showDenyButton: true,
        confirmButtonText: "Pay now",
        confirmButtonColor: '#007bff',
        denyButtonText: `Cancel`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.paymentService.payNowClicked(deductionAmount);
          let paymentConfirmed: boolean;
          const subscription = this.paymentService.isPaymentConfirmed.subscribe({
            next: data => {
              paymentConfirmed = data;
              subscription.unsubscribe();
              if (paymentConfirmed) {
                this.bookSlot(deductionAmount);
              }
            },
            error: error => {
              console.error(error);
              subscription.unsubscribe();
            }
          })
        } else if (result.isDenied) {
          Swal.fire({
            text: "Booking canceled",
            icon: "info",
            confirmButtonColor: '#007bff'
          });
        }
      });
    }
    else {
      this.bookSlot(deductionAmount);
    }
  }

  updateWallet(deductionAmount: number) {
    // detect amount from user
    const userName = localStorage.getItem('username')
    this.paymentService.updateWallet(-deductionAmount, userName).subscribe(
      {
        next: value => {
          this.authService.setWalletAmount(value);
          console.log("updated amount ", value);

        },
        error: error => {
          console.error(error);
        }
      }
    );

    const dealerName: string = this.chargingStationService.getDealerName();
    const dealerAmount = deductionAmount * 0.90;
    this.paymentService.updateWallet(dealerAmount, dealerName).subscribe(
      {
        next: value => {
          console.log("dealer amount updated", value);
        },
        error: error => {
          console.error(error);
        }
      }
    );

    const adminName = 'admin1';
    const adminAmount = deductionAmount * 0.10;
    this.paymentService.updateWallet(adminAmount, adminName).subscribe(
      {
        next: value => {
          console.log("dealer amount updated", value);
        },
        error: error => {
          console.error(error);
        }
      }
    );





  }



  bookSlot(deductionAmount: number) {

    const startTimeStr = `${this.fromDate}T${this.fromTime}`;
    const endTimeStr = `${this.fromDate}T${this.toTime}`;
    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);
    const duration = this.getDuration(startTime, endTime);

    console.log(startTimeStr);


    if (this.fromDate && this.fromTime && this.toTime) {
      const date = new Date();
      const chargingStationId = this.slotService.getChargingStationId();
      const dateTime = `${this.fromDate}T00:00`;
      const username = this.authService.getUsername();
      const body = {
        chargingStationId: chargingStationId,
        startTime: startTimeStr,
        duration: duration,
        date: dateTime,
        bookedBy: username,
        isExpired: false
      }
      const email = this.authService.getEmail();
      const emailBody = {
        toEmail: email === null ? '' : email,
        subject: "Booking Confirmed",
        body: `<div style="font-family: Arial, sans-serif; color: #333; background-color: #f8f8f8; padding: 20px; border-radius: 10px;">
        <p style="font-size: 18px;"><strong>Slot reserved at <span style="color: #007bff;">${this.slotService.getChargingStationName()}</span> is confirmed on <span style="color: #007bff;">${date}</span> from <span style="color: #007bff;">${startTime}</span> to <span style="color: #007bff;">${endTime}</span>,</strong></p>
        <p style="font-size: 16px;">Slot activation mail will be send to you during start time of your slot to confirm you are at the station, you can activate charging port by clicking activate slot.</p>
        <p style="font-size: 16px;">Thank you for choosing us!</p>
        <p style="font-style: italic; font-size: 14px;">Regards,<br/>Regal-grid </p>
        <img src="cid:logo" alt="Regal-grid logo" style="max-width: 50%; height: 50%; display: block; margin: 20px auto;">  
    </div>    
        `
      }

      this.slotService.bookSlot(body).subscribe({
        next: response => {
          this.updateWallet(deductionAmount)
          Swal.fire({
            title: "Good job!",
            text: response,
            icon: "success",
            confirmButtonColor: '#007bff'
          });
          console.log("email", emailBody);
          this.emailService.sendEmail(emailBody).subscribe({
            next: data => {
              console.log(data);
              console.log("booking email send");
            },
            error: error => {
              console.error("email", error);
            }
          });
        },
        error: error => {
          Swal.fire({
            text: "Something went wrong",
            confirmButtonColor: '#007bff'
          })
          console.error(error.message);
        }
      })
    }
    else {
      Swal.fire({
        text: 'Unknown error',
        confirmButtonColor: '#007bff'
      });
      console.error('Slot timing required');
    }
  }

  hours!: number;
  minutes!: number;
  getDuration(startTime: Date, endTime: Date): string | null {
    const durationInMillis = endTime.getTime() - startTime.getTime();
    this.hours = Math.floor(durationInMillis / (1000 * 60 * 60));
    this.minutes = Math.floor((durationInMillis % (1000 * 60 * 60)) / (1000 * 60));
    console.log(this.hours);
    console.log(this.minutes);

    if (this.hours < 0 || this.minutes < 5) {
      return null;
    }
    const durationISO = `PT${this.hours}H${this.minutes}M`;
    return durationISO;
  }

  selectedDate = localStorage.getItem('selectedDate');
  selectedTime = localStorage.getItem('selectedTime');
  specificSlots!: Slot[];

  getSlotsForDate() {
    if (this.selectedDate && this.selectedTime) {
      localStorage.setItem('selectedDate', this.selectedDate);
      localStorage.setItem('selectedTime', this.selectedTime);
      const dateTimeString = `${this.selectedDate}T${this.selectedTime}`;
      console.log("dateTimeString", dateTimeString);
      const dateTime = new Date(dateTimeString);
      const chargingStationId = this.slotService.getChargingStationId();
      this.slotService.fetchAllSlot(chargingStationId, dateTime);
      this.getAllSlots();

    } else {
      Swal.fire({
        text: 'Date and time are required',
        confirmButtonColor: '#007bff'
      });
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