import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SlotService {

  constructor(private http: HttpClient) { }

  dateToString(date: Date): string {
    const currentDateUTC = date;

    // Adjust the time zone offset for IST (UTC+5:30)
    const ISTOffset = 330; // Offset in minutes
    const ISTTime = new Date(currentDateUTC.getTime() + ISTOffset * 60 * 1000);

    // Convert the IST time to the desired format
    const formattedDate = ISTTime.toISOString().slice(0, 19);

    return formattedDate;
  }

  bookSlotUrl = `${environment.baseUrl}/slot/post`
  bookSlot(body: any): Observable<any> {
    const response = this.http.post<any>(this.bookSlotUrl, body);
    console.log(response);
    return response;
  }

  getBookedSlotsUrl = `${environment.baseUrl}/slot/bookedslots`
  getBookedSlots(): Observable<any> {
    const response = this.http.get<any>(this.getBookedSlotsUrl);
    console.log(response);
    return response;
  }


  getAvailableSlots(date: Date): Observable<any> {
    const getAvailableSlotsUrl = `${environment.baseUrl}/slot/availableslots?date=${date}`;
    console.log(getAvailableSlotsUrl);
    const response = this.http.get<any>(getAvailableSlotsUrl);
    console.log(response);
    return response;
  }

  getAllSlotsByDate(date: Date): Observable<any> {
    const dateString = this.dateToString(date);
    const getAvailableSlotsUrl = `${environment.baseUrl}/slot/getallslotsbydate?date=${dateString}`;
    console.log(getAvailableSlotsUrl);
    const response = this.http.get<any>(getAvailableSlotsUrl);
    console.log(response);
    return response;
  }

  getAllChargingStations(userLatitude:string, userLongitude:string) {
    const latitude = userLatitude;
    const longitude = userLongitude;
    const getAllChargingStationsUrl = `${environment.baseUrl}chargingstation/getall?userLatitude=${latitude}&userLongitude=${longitude}`;
    const response = this.http.get<any>(getAllChargingStationsUrl);
    console.log(response);
    return response;
  }

}