import { Component } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';

declare let Razorpay:any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent {

  constructor(private paymentService: PaymentService) {}

  payNowClicked() {
    this.paymentService.createOrder(1000).subscribe({
      next: response => {
        this.openTransactionModel(response);
      },
      error: response => {
        alert(response);
      }
    });
  }

  openTransactionModel(response: any) {
    const options = {
      order_id: response.orderId,
      key: response.key,
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
          alert('Payment failed..');
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
  }
}

