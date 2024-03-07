import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class VehicleService {

  expectedChargeHour!: number;
  expectedChargeMinutes!: number;
  setExpectedChargeTime(expectedChargeHour: number, expectedChargeMinutes: number) {
    console.log(expectedChargeHour);
    console.log(expectedChargeMinutes);
    this.expectedChargeHour = expectedChargeHour;
    this.expectedChargeMinutes = expectedChargeMinutes;
    
    localStorage.setItem('expectedChargeHour', expectedChargeHour.toString());
    localStorage.setItem('expectedChargeMinutes', expectedChargeMinutes.toString());
  }

  getExpectedChargeHour(){
    const expectedChargeHourStr = localStorage.getItem('expectedChargeHour');
    console.log(expectedChargeHourStr);
    
    // return expectedChargeHourStr !== null ? parseFloat(expectedChargeHourStr) : 0 ;
    return this.expectedChargeHour;
  }

  getExpectedChargeMinutes(){
    const expectedChargeMinutesStr = localStorage.getItem('expectedChargeHour');
    console.log(expectedChargeMinutesStr);
    
    // return expectedChargeMinutesStr !== null ? parseFloat(expectedChargeMinutesStr) : 0 ;
    return this.expectedChargeMinutes;
  }

  constructor(private http: HttpClient) { }

  getVehicle(username: string) {
    const getVehicleUrl = `${environment.baseUrl}/vehicle/getvehicle?username=${username}`;
    console.log(getVehicleUrl);
    const response = this.http.get<any>(getVehicleUrl);
    console.log(response);
    return response;
  }

  addVehicle(body: any, username: string) {
    const postVehicleUrl = `${environment.baseUrl}/vehicle/postuservehicle/${username}`;
    console.log(postVehicleUrl);
    const response = this.http.post(postVehicleUrl, body, { responseType: 'text' });
    console.log(response);
    return response;
  }

  addVehicleBrand(body: any) {
    const postVehicleUrl = `${environment.baseUrl}/vehicle/postvehiclebrand`;
    console.log(postVehicleUrl);
    const response = this.http.post(postVehicleUrl, body, { responseType: 'text' });
    console.log(response);
    return response;
  }

  getExpectedTimeDuration(vehicleModel:string, currentCharge:number , expectedCharge: number) {
    const getExpectedTimeDurationUrl = `${environment.baseUrl}/vehicle/getestimatedchargingtime/${vehicleModel}/${currentCharge}/${expectedCharge}`;
    console.log(getExpectedTimeDurationUrl);
    const response = this.http.get<any>(getExpectedTimeDurationUrl);
    console.log(response);
    return response;
  }

  getExpectedCharge(vehicleModel:string, currentCharge:number , time: number) {
    const getExpectedTimeDurationUrl = `${environment.baseUrl}/vehicle/getexpectedcharge/${vehicleModel}/${currentCharge}/${time}`;
    console.log(getExpectedTimeDurationUrl);
    const response = this.http.get<any>(getExpectedTimeDurationUrl);
    console.log(response);
    return response;
  }
  }
