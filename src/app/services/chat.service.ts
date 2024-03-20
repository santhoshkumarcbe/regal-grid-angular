import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Chat } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {}

  private username = new BehaviorSubject('');
  
  setUsername(name:string){
    this.username.next(name);
  }

  getUsername(){
    return this.username.asObservable();
  }

  getChats(senderId: string, receiverId: string): Observable<any> {
    const getAllChatsUrl = `${'http://localhost:8080/chat/getallchats?senderId='}${senderId}${'&receiverId='}${receiverId}`;
    console.log("getAllChatsUrl", getAllChatsUrl);
    const response = this.http.get<Chat[]>(getAllChatsUrl);
    console.log(response);
    return response;
  }
  

  // chatId is username of user
  getAllChatsByChatId(chatId:string){
    const getAllChatsByChatIdUrl = `${environment.baseUrl}/chat/getallchatsbychatid/${chatId}`;
    console.log("getAllChatsByChatIdUrl", getAllChatsByChatIdUrl);
    const response = this.http.get<Chat[]>(getAllChatsByChatIdUrl);
    console.log(response);
    return response;
  }

  sendChat(chat:Chat): Observable<any> {
    const sendChatUrl = environment.baseUrl + '/chat/post';
    console.log(sendChatUrl);
    const response = this.http.post<any>(sendChatUrl, chat);
    console.log(response);
    return response;
  }
}
