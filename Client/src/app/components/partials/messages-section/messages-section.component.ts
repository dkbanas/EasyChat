import {Component, Input} from '@angular/core';
import {ChatService} from "../../../services/chat.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-messages-section',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './messages-section.component.html',
  styleUrl: './messages-section.component.scss'
})
export class MessagesSectionComponent {
  @Input() messages: { user: string, message: string }[] = [];
  @Input() user: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
  }
}
