import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getAllusersUrl = `${environment.baseUrl}/user/getall`
  getAllUsers(): Observable<any> {
    const response = this.http.get<any>(this.getAllusersUrl);
    console.log(response);
    return response;
  }

  getAuthoritiesUrl = `${environment.baseUrl}/api/auth/authorities/get`
  getAuthorities(): Observable<any> {
    const response = this.http.get<any>(this.getAuthoritiesUrl);
    console.log(response);
    return response;
  }

} 
