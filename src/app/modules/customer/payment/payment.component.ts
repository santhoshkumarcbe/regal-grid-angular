import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import Swal from 'sweetalert2';

declare let Razorpay:any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent {
  amount!:number;
  constructor(private paymentService: PaymentService, private auth: AuthService, private router:Router) {}

  topupAmount!:number;
  payNowClicked() {
    this.topupAmount = this.amount
    this.paymentService.createOrder(this.amount).subscribe({
      next: response => {
        this.openTransactionModel(response);
        console.log("order", response);
        
      },
      error: response => {
        console.error(response);
      }
    });
  }

  openTransactionModel(response: any) {
    const options = {
      order_id: response.orderId,
      key_id: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'Regal grid payment',
      description: 'Payment for booking charging slot',
      image: "../../../../assets/logo.png",
      prefill: {
        name: 'Regal grid',
        email: 'regalgridforev@gmail.com',
        contact: '9003801731'
      },
      handler: (response: any) => {
        if (response != null && response.razorpay_payment_id != null)
          this.processResponse(response);
        else
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Payment failed !",
          confirmButtonColor: '#007bff'
        });
      },
      notes: {
        address: 'Book slot in charging station'
      },
      theme: {
        color: '#a4eece'
      },
      modal: {
        ondismiss: () => {
          console.log('dismissed');
        }
      }
    };

    let razorpayObject: any = new Razorpay(options);
    razorpayObject.open();

  }
  processResponse(response: any) {
    console.log(response);
    const userName = localStorage.getItem('username')
    this.paymentService.updateWallet(this.topupAmount, userName).subscribe(
      {
        next: value => {
          this.auth.setWalletAmount(value);
          this.router.navigateByUrl('/customer');
        }
      }
    )
  }
}

