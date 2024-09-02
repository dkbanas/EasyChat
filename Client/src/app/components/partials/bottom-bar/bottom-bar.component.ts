import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChatService} from "../../../services/chat.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-bottom-bar',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './bottom-bar.component.html',
  styleUrl: './bottom-bar.component.scss'
})
export class BottomBarComponent {
  @Input() message: string = '';
  @Output() messageChange = new EventEmitter<string>();

  constructor(private chatService: ChatService) {}

  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      this.message = '';
      this.messageChange.emit(this.message);
    }
  }
}
