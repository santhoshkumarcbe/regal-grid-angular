import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  createOrder(amount: number) {
    return this.http.get(`${environment.baseUrl}/payment/createTransaction/${amount}`);
  }
}
