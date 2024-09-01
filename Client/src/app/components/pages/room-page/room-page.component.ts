import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ChatService} from "../../../services/chat.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-room-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-page.component.html',
  styleUrl: './room-page.component.scss'
})
export class RoomPageComponent {
  user = 'User1';
  roomName = 'Room1';
  message = '';
  messages: { user: string, message: string }[] = [];
  users: string[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
    });

    this.chatService.users$.subscribe((users) => {
      this.users = users;
    });

    this.joinRoom();
  }

  async joinRoom(): Promise<void> {
    await this.chatService.joinRoom(this.user, this.roomName);
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      this.message = '';
    }
  }

  closeConnection(): void {
    this.chatService.closeConnection();
  }

}
