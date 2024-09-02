import {Component, Input} from '@angular/core';
import {ChatService} from "../../../services/chat.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.scss'
})
export class TopNavbarComponent {
  @Input() roomName: string = '';

  constructor(private chatService: ChatService, private router: Router) {}

  closeConnection(): void {
    this.chatService.closeConnection();
    this.router.navigate(['']);
  }
}
