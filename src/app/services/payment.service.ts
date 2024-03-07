import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }



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
}
