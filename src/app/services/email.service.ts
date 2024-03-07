import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Email } from '../models/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  sendEmail(body:Email){
    console.log(body);
    
    const sendEmailUrl = `${environment.baseUrl}/email/mail`;
    const response = this.http.post(sendEmailUrl,body);
    console.log(response);
    return response
    
  }
}
