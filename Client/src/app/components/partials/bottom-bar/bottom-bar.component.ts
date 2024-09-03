import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChatService} from "../../../services/chat.service";
import {FormsModule} from "@angular/forms";
import {PickerComponent} from "@ctrl/ngx-emoji-mart";
import {NgIf} from "@angular/common";
import {EmojiComponent} from "@ctrl/ngx-emoji-mart/ngx-emoji";

@Component({
  selector: 'app-bottom-bar',
  standalone: true,
  imports: [
    FormsModule,
    PickerComponent,
    NgIf,
    EmojiComponent
  ],
  templateUrl: './bottom-bar.component.html',
  styleUrl: './bottom-bar.component.scss'
})
export class BottomBarComponent {
  @Input() message: string = '';
  @Output() messageChange = new EventEmitter<string>();
  showEmojiPicker: boolean = false;

  constructor(private chatService: ChatService) {}

  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      this.message = '';
      this.messageChange.emit(this.message);
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }


  addEmoji(event: { emoji: { native: string } }) {
    this.message += event.emoji.native;
    this.showEmojiPicker = false;
  }


}
