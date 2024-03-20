import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { chargingStation } from '../models/chargingStationDistance.model';

@Injectable({
  providedIn: 'root'
})
export class ChargingStationService {

  constructor(private http:HttpClient) { }


  setDealerName(dealerName: string){
    localStorage.setItem('dealerName', dealerName);
  }

  getDealerName(): string{
    const dealerName = localStorage.getItem('dealerName');
    return dealerName === null ? '': dealerName;
  }

  postChargingStation(chargingStation: any){
    const postChargingStationUrl = `${environment.baseUrl}/chargingstation/post`;
    console.log(postChargingStationUrl);
    const response = this.http.post(postChargingStationUrl, chargingStation, {responseType: 'text'});
    console.log(response);
    return response;
  }

  getAllChargingStations(userLatitude: number, userLongitude: number) {
    const latitude = userLatitude;
    const longitude = userLongitude;
    const getAllChargingStationsUrl = `${environment.baseUrl}/chargingstation/getall?userLatitude=${latitude}&userLongitude=${longitude}`;
    console.log(getAllChargingStationsUrl);

    const response = this.http.get<any>(getAllChargingStationsUrl);
    console.log(response);
    return response;
  }

  getAllChargingStationsByDealerName(dealerName: string){
    const getAllChargingStationsByDealerNameUrl = `${environment.baseUrl}/chargingstation/getallbydealerName/${dealerName}`;
    console.log(getAllChargingStationsByDealerNameUrl);
    const response = this.http.get<chargingStation[]>(getAllChargingStationsByDealerNameUrl);
    console.log(response);
    return response;
  }
}
