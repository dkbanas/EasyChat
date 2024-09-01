import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ChatService} from "../../../services/chat.service";

@Component({
  selector: 'app-join-page',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './join-page.component.html',
  styleUrl: './join-page.component.scss'
})
export class JoinPageComponent {
  userName: string = '';
  roomName: string = '';

  constructor(private chatService: ChatService, private router: Router) {}

  async joinRoom(): Promise<void> {
    if (this.userName && this.roomName) {
      await this.chatService.joinRoom(this.userName, this.roomName);
      this.router.navigate(['/room']);
    }
  }
}
