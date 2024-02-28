import { Component } from '@angular/core';
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
  currentUser!: User;
  userId!: string | null;
  managerId = "65d442bc46682a569abe0113";
  chat= {
    senderId: "65d445dd46682a569abe0115",
    receiverId: this.managerId,
    message: '',
    time: new Date(),
  };

  constructor(
    private chatService: ChatService,
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    if (this.userId) {
      this.chatService
        .getChats(this.userId, this.managerId)
        .subscribe({
          next: chats => {
            this.chats = chats;
            console.log("chats", chats);
            this.newMessageText = '';
          },
          error: Error => {
            alert(Error.message);
          }
        }
        );
    }
  }

  currentDateTime(): void {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 5);
    currentDate.setMinutes(currentDate.getMinutes() + 30);
    this.chat.time = currentDate;
  }

  sendMessage(text: string): void {
    if (this.userId) {
      // Implement logic to send a message
      this.chat.message = text;
      this.currentDateTime();
      this.chatService.sendChat(this.chat).subscribe(
        (chats) => {
          this.chats = chats;
          console.log("chats", chats);  
          this.loadMessages();
        },
        (err: Error) => {
          alert(err.message);
        }
      );
    }
  }
}
