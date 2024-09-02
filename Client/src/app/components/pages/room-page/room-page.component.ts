import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ChatService} from "../../../services/chat.service";
import {FormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {BottomBarComponent} from "../../partials/bottom-bar/bottom-bar.component";
import {MessagesSectionComponent} from "../../partials/messages-section/messages-section.component";
import {TopNavbarComponent} from "../../partials/top-navbar/top-navbar.component";

@Component({
  selector: 'app-room-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomBarComponent, MessagesSectionComponent, TopNavbarComponent],
  templateUrl: './room-page.component.html',
  styleUrl: './room-page.component.scss'
})
export class RoomPageComponent {
  user = '';
  roomName = '';
  message = '';
  messages: { user: string, message: string }[] = [];
  users: string[] = [];

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.chatService.getUser() || '';
    this.roomName = this.chatService.getRoom() || '';

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

  closeConnection(): void {
    this.chatService.closeConnection();
    this.router.navigate(['']);
  }
}
