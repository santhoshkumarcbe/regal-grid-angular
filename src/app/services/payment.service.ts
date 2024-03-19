import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
declare let Razorpay:any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient, private auth:AuthService) { }

  walletBalance!: number;

  createOrder(amount: number) {
    return this.http.get(`${environment.baseUrl}/payment/createTransaction/${amount}`);
  }

  setWalletBalance(balance:number){
    this.walletBalance = balance;
    localStorage.setItem('walletBalance', balance.toString())
  }

  getWalletBalance(){
    // const balanceStr = localStorage.getItem('walletBalance');
    // const balance = balanceStr === null ? 0 : parseFloat(balanceStr);
    return this.walletBalance;
  }

   updateWallet(amount: number, userName: string | null) {
    const updateWalletUrl = `${environment.baseUrl}/user/updatewallet/${userName}/${amount}`
    const response = this.http.put<any>(updateWalletUrl, null);
    console.log(response);
    return response;
  }

  topupAmount!:number;
  payNowClicked(amount:number) {
    this.topupAmount = amount;
    this.createOrder(amount).subscribe({
      next: response => {
        this.openTransactionModel(response);
        console.log("order", response);
        
      },
      error: response => {
        alert(response);
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
          this.emitPaymentStatus(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Payment failed..!",
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
    this.updateWallet(this.topupAmount, userName).subscribe(
      {
        next: value => {
          this.auth.setWalletAmount(value);
          this.emitPaymentStatus(true);
        },
        error: error => {
          console.error(error);
          this.emitPaymentStatus(false);
        }
      }
    )
  }

  private confirmPayment = new Subject<boolean>();

  isPaymentConfirmed = this.confirmPayment.asObservable();

  emitPaymentStatus(status:boolean){
    this.confirmPayment.next(status);
  }
  


}
