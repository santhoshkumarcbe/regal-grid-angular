import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Chat } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  
  constructor(private http: HttpClient) {}

  getChats(senderId: any, receiverId: any): Observable<any> {
    const getAllChatsUrl = `${'http://localhost:8080/chat/getallchats?senderId='}${senderId}${'&receiverId='}${receiverId}`;
    console.log("getAllChatsUrl", getAllChatsUrl);
    const response = this.http.get<Chat[]>(getAllChatsUrl);
    console.log(response);
    return response;
  }

  sendChat(message:any): Observable<any> {
    // Implement logic to send a message to the API
    const response = this.http.post<any>(environment.baseUrl + '/chat/post', message);
    console.log(response);
    return response;
  }
}
