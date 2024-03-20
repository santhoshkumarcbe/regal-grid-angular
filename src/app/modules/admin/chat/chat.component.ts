import { Component, ElementRef, ViewChild } from '@angular/core';
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
export class ChatComponent {
  chats: Chat[] = [];
  newMessageText: string = '';
  currentUser!: User; // Initialize currentUser as undefined initially

  userId = "";
  adminId = this.authService.getUserId().replace(/["']/g, '');
  chat: Chat= {
    chatId: '',
    senderId: this.adminId,
    receiverId: this.userId,
    message: '',
    time: new Date(),
  };

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    console.log("admin id", this.adminId);
    
    // autofocus input 
    setTimeout(() => {
      this.messageInput.nativeElement.focus();
    }, 0);

    this.chatService.getUsername().subscribe({
      next: data => {
        this.getUserDetails(data);
      },
      error: error => {
        console.error(error);
      }
    })
    
  }

  getUserDetails(username:string){
    this.authService.getUserByUsername(username).subscribe({
      next: data => {
        this.currentUser = data;
        this.userId = this.currentUser.userId;
        this.loadMessages();
        this.chat.chatId = this.currentUser.username;
        this.chat.receiverId = this.userId;
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
      switchMap(() => this.chatService.getAllChatsByChatId(this.currentUser.username))).subscribe({
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
    this.chat.senderId = this.adminId;
    this.chat.receiverId = this.userId;
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
