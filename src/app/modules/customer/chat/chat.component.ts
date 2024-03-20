import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { interval, Subscription, switchMap } from 'rxjs';
import { Chat } from 'src/app/models/chat.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chats: Chat[] = [];
  newMessageText: string = '';
  currentUser!: User; 
  chaticon = faMessage;
  userId = "";
  adminId = "65d442bc46682a569abe0113";
  chat: Chat= {
    chatId: '',
    senderId: this.userId,
    receiverId: this.adminId,
    message: '',
    time: new Date(),
  };

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;
  ngOnInit() {
    // autofocus input 
    setTimeout(() => {
      this.messageInput.nativeElement.focus();
    }, 0);

    const username = localStorage.getItem('username');
    this.authService.getUserByUsername(username).subscribe({
      next: data => {
        this.currentUser = data;
        this.userId = this.currentUser.userId;
        this.loadMessages();
        this.chat.chatId = this.currentUser.username;
      },
      error: error => {
        console.error(error);
      }
    })

  }

  subscription!: Subscription
  loadMessages() {
    this.subscription = interval(1000)
    .pipe(
      switchMap(() => this.chatService.getChats(this.currentUser.userId, this.adminId))).subscribe({
      next: chats => {
        this.chats = chats;
        // console.log("chats", this.chats);
      },
      error: error => {
        console.error(error);
      }
    });
  }

  currentDateTime(): void {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 5);
    currentDate.setMinutes(currentDate.getMinutes() + 30);
    this.chat.time = currentDate;
  }

  sendMessage(text: string): void {
    this.messageInput.nativeElement.focus();
    this.chat.message = text;
    this.chat.senderId = this.userId;
    this.currentDateTime();
    console.log(this.chat);
    this.chatService.sendChat(this.chat).subscribe({
      next: chat => {
        console.log("chat posted successfully");
        console.log(chat);
        this.newMessageText = '';
        this.loadMessages();
      },
      error: error => {
        console.error(error);
      },
      complete: () => {
        this.loadMessages();
      }
    }

      
    );
  }
}
