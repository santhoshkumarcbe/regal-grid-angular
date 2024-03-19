import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, catchError, takeUntil, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Slot } from '../models/slot.model';

@Injectable({
  providedIn: 'root'
})
export class SlotService {
  setCostPerMinute(costPerMinute: number) {
    localStorage.setItem('costPerMinute', costPerMinute.toString());
  }

  getCostPerMinute(){
    const cost = localStorage.getItem('costPerMinute');
    const num =  cost === null ? 0 : parseFloat(cost);
    return num;
  }

  constructor(private http: HttpClient, private datePipe: DatePipe) { }
  private destroy$: Subject<void> = new Subject<void>();
  isGetSlotsClicked = false;

  chargingStationId!: string | null;

  setChargingStationId(id: string) {
    localStorage.setItem('chargingStationId', id);
    this.chargingStationId = id;
  }

  getChargingStationId() {
    this.chargingStationId = localStorage.getItem('chargingStationId');
    return this.chargingStationId;
  }

  setChargingStationName(name: string){
    localStorage.setItem('chargingStationName', name);
  }

  getChargingStationName(){
    return localStorage.getItem('chargingStationName');
  }

  calculateEndTime(startTime: string, duration: string): string | null {
    const start = new Date(startTime);
    const durationParts = duration.split('T')[1].split(/[HMS]/);
    // console.log("durationParts", durationParts);

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (duration.includes('H')) {
      hours = parseInt(durationParts[0]);
    }

    if (duration.includes('M')) {
      if (duration.includes('H')) {
        minutes = parseInt(durationParts[1]);
      } else {
        minutes = parseInt(durationParts[0]);
      }
    }

    if (duration.includes('S')) {
      if (duration.includes('H') && duration.includes('M')) {
        seconds = parseInt(durationParts[2]);
      } else if (duration.includes('M') && !duration.includes('H') || duration.includes('M') && !duration.includes('H')) {
        seconds = parseInt(durationParts[1]);
      } else {
        seconds = parseInt(durationParts[0]);
        console.log("seconds", seconds);
      }
    }

    let endTime: any = new Date(start.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000);
    endTime = endTime.toString(); // You can format the date as required
    console.log("endTime", endTime);

    return this.datePipe.transform(endTime, 'medium', 'IST');
  }

  getISTTime(time: string): string | null {
    // Convert UTC time to IST
    const startTime = new Date(time);
    return this.datePipe.transform(startTime, 'medium', 'IST');
  }

  dateToString(date: Date): string {
    const currentDateUTC = date;

    // Adjust the time zone offset for IST (UTC+5:30)
    const ISTOffset = 330; // Offset in minutes
    const ISTTime = new Date(currentDateUTC.getTime() + ISTOffset * 60 * 1000);

    // Convert the IST time to the desired format
    const formattedDate = ISTTime.toISOString().slice(0, 19);

    return formattedDate;
  }


  bookSlot(body: any): Observable<any> {
    const bookSlotUrl = `${environment.baseUrl}/slot/post`
    console.log(bookSlotUrl);
    const response = this.http.post(bookSlotUrl, body, { responseType: 'text' });
    // console.log(response);
    return response;
  }

  getAllSlotsByDate(id: string | null, date: Date): Observable<any> {
    const dateString = this.dateToString(date);
    const getAvailableSlotsUrl = `${environment.baseUrl}/slot/getallslotsbydate?date=${dateString}&chargingStationId=${id}`;
    console.log(getAvailableSlotsUrl);
    const response = this.http.get<any>(getAvailableSlotsUrl);
    console.log(response);
    return response;
  }

  private getAllSlots: ReplaySubject<Slot[]> = new ReplaySubject(1);
  fetchAllSlot(id: string | null, date: Date) {
    this.isGetSlotsClicked = true;
    const dateString = this.dateToString(date);
    const getAvailableSlotsUrl = `${environment.baseUrl}/slot/getallslotsbydate?date=${dateString}&chargingStationId=${id}`;
    console.log(getAvailableSlotsUrl);
    const response = this.http.get<any>(getAvailableSlotsUrl).subscribe({
      next: slots => {
        this.getAllSlots.next(slots);
      },
      error: error => {
        console.error(error.message);  
      }
    }

     )

  }

  getAllSlot() {
    return this.getAllSlots.asObservable().pipe(takeUntil(this.destroy$));;
  }

  getAllSlotsByChargingStationId(chargingStationId : string){
    const getAllSlotsByChargingStationIdUrl = `${environment.baseUrl}/slot/getallbookedslots?chargingStationId=${chargingStationId}`;
    console.log(getAllSlotsByChargingStationIdUrl);
    const response = this.http.get<Slot[]>(getAllSlotsByChargingStationIdUrl);
    console.log(response);
    return response;
  }

  findSlotById(id:string){
    const findSlotByIdUrl = `${environment.baseUrl}/slot/findslotbyid/${id}`;
    console.log(findSlotByIdUrl);
    const response = this.http.get<Slot>(findSlotByIdUrl);
    console.log(response);
    return response;
  }

  setSlotExpiredTrue(id:string){
    const setSlotExpiredTrueUrl = `${environment.baseUrl}/slot/setSlotExpired/${id}`;
    console.log(setSlotExpiredTrueUrl);
    const response = this.http.put(setSlotExpiredTrueUrl,null, { responseType: 'text' });
    console.log(response);
    return response;
  }
}