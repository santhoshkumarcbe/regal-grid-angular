import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sessionTime!: number;
  constructor(private router: Router, private http: HttpClient) { }

  user!: User;
  amount!: number

  setToken(token: string): void {
    localStorage.setItem('token', token);
    console.log(token);
  }

  setUser(user: User): void {
    this.user = user
    console.log('user', this.user);
  }

  setUsername(username: string): void {
    localStorage.setItem('username', username);
    console.log(username);
  }

  setWalletAmount(amount: number) {
    this.amount = amount;
    localStorage.setItem('wallet', amount.toLocaleString());
    console.log("wallet", amount);
    this.getWalletAmount()
  }

  setEmail(email:string){
    localStorage.setItem('email', email);
  }

  getEmail(){
    return localStorage.getItem('email');
  }

  amountString = new BehaviorSubject(localStorage.getItem('wallet'))
  getWalletAmount(){
          this.amountString.next(localStorage.getItem('wallet'));
  }

  getAmount(){
    this.amountString.subscribe({
      next: amount => {
        return amount;
      },
      error: error => {
        Swal.fire(error.body);
      }
    })
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User {
    return this.user;
  }

  getUsername(): string | null {
    const username = localStorage.getItem('username');
    console.log('user Name : ', username);
    return username;
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.clear();
  }
  loginUrl = `${environment.baseUrl}/api/auth/login`
  authenticate(body: any): Observable<any> {
    const response = this.http.post<any>(this.loginUrl, body);
    console.log(response);
    return response;
  }

  registerUrl = `${environment.baseUrl}/api/auth/register`
  register(body: any): Observable<any> {
    const response = this.http.post<any>(this.registerUrl, body);
    console.log(response);
    return response;
  }

  updatePassword(username:string, newPassword:string){
    const updatePasswordUrl = `${environment.baseUrl}/api/auth/updatepassword/${username}/${newPassword}`;
    const response = this.http.put(updatePasswordUrl,null);
    console.log(response);
    return response;
  }

  getEmailByUserName(username:string){
    const getEmailByUserNameUrl = `${environment.baseUrl}/api/auth/getEmailByUserName/${username}`;
    const response = this.http.get(getEmailByUserNameUrl, {responseType: 'text'});
    console.log(response);
    return response;
  }

  isUsernameExists(username:any){
    const isUsernameExistsUrl = `${environment.baseUrl}/api/auth/isusernameExist/${username}`;
    console.log(isUsernameExistsUrl);
    
    const response = this.http.get<boolean>(isUsernameExistsUrl);
    console.log(response);
    return response;
  }

  isEmailExists(email:any){
    const isEmailExistsUrl = `${environment.baseUrl}/api/auth/isEmailExist/${email}`;
    console.log(isEmailExistsUrl);
    
    const response = this.http.get<boolean>(isEmailExistsUrl);
    console.log(response);
    return response;
  }

  isMobileNumberExists(mobilenumber:any){
    const isMobileNumberExistsUrl = `${environment.baseUrl}/api/auth/isMobilenumberExist/${mobilenumber}`;
    console.log(isMobileNumberExistsUrl);
    
    const response = this.http.get<boolean>(isMobileNumberExistsUrl);
    console.log(response);
    return response;
  }
  
  clearLocalStorageAfterTime(time: number) {
    this.sessionTime = setTimeout(() => {
      localStorage.clear();
      console.log('Local storage cleared.');
      alert('session expired.');
      this.router.navigateByUrl('/');
    }, time)
    return this.sessionTime
  }


  behaviorSubject = new BehaviorSubject<boolean>(true);

  setData(data: boolean) {
    this.behaviorSubject.next(data);
    console.log(data);

  }

  getData() {
    return this.behaviorSubject;
  }

}
