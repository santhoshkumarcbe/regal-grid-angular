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
  sessionTime!: any;
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

  setUserId(userId: string) {
    localStorage.setItem('userId', userId);
  }

  getUserId(): string {
    const userId = localStorage.getItem('userId');
    console.log("user id ", userId);

    return userId === null ? '' : userId;
  }

  setWalletAmount(amount: number) {
    this.amount = amount;
    localStorage.setItem('wallet', amount.toLocaleString());
    console.log("wallet", amount);
  }

  getInitialBalance(){
    return localStorage.getItem('wallet');
  }

  setEmail(email: string) {
    localStorage.setItem('email', email);
  }

  getEmail() {
    return localStorage.getItem('email');
  }

  getWalletAmount(){
    return this.getWalletAmountByUserName(localStorage.getItem('username')!.toString());
  }

  getWalletAmountByUserName(username:string) {
    const getWalletAmountByUserNameUrl = `${environment.baseUrl}/user/getwalletbalancebyusername/${username}`;
    const response = this.http.get(getWalletAmountByUserNameUrl, { responseType: 'text' });
    console.log(response);
    return response;
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

  updatePassword(username: string, newPassword: string) {
    const updatePasswordUrl = `${environment.baseUrl}/api/auth/updatepassword/${username}/${newPassword}`;
    const response = this.http.put(updatePasswordUrl, null);
    console.log(response);
    return response;
  }

  getEmailByUserName(username: string) {
    const getEmailByUserNameUrl = `${environment.baseUrl}/api/auth/getEmailByUserName/${username}`;
    const response = this.http.get(getEmailByUserNameUrl, { responseType: 'text' });
    console.log(response);
    return response;
  }

  isUsernameExists(username: any) {
    const isUsernameExistsUrl = `${environment.baseUrl}/api/auth/isusernameExist/${username}`;
    console.log(isUsernameExistsUrl);

    const response = this.http.get<boolean>(isUsernameExistsUrl);
    console.log(response);
    return response;
  }

  isEmailExists(email: any) {
    const isEmailExistsUrl = `${environment.baseUrl}/api/auth/isEmailExist/${email}`;
    console.log(isEmailExistsUrl);

    const response = this.http.get<boolean>(isEmailExistsUrl);
    console.log(response);
    return response;
  }

  isMobileNumberExists(mobilenumber: any) {
    const isMobileNumberExistsUrl = `${environment.baseUrl}/api/auth/isMobilenumberExist/${mobilenumber}`;
    console.log(isMobileNumberExistsUrl);

    const response = this.http.get<boolean>(isMobileNumberExistsUrl);
    console.log(response);
    return response;
  }

  getUserByUsername(username: string | null) {
    const getUserByUsernameUrl = `${environment.baseUrl}/user/getuserbyusername/${username}`;
    console.log(getUserByUsernameUrl);

    const response = this.http.get<User>(getUserByUsernameUrl);
    console.log(response);
    return response;
  }

  clearLocalStorageAfterTime(time: number) {
    this.sessionTime = setTimeout(() => {
      localStorage.clear();
      console.log('Local storage cleared.');
      Swal.fire({
        text:'session expired.',
        icon: 'error',
        confirmButtonColor: '#007bff'
      })
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
