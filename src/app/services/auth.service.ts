import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sessionTime!: number;
  constructor(private router: Router, private http: HttpClient) { }

  user!: User;

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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User {
    return this.user;
  }

  getUsername(): string | null {
    const username = localStorage.getItem('username');
    console.log('tuser', username);
    return username;
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
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
