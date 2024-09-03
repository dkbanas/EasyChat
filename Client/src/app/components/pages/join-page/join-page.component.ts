import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ChatService} from "../../../services/chat.service";

@Component({
  selector: 'app-join-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './join-page.component.html',
  styleUrl: './join-page.component.scss'
})
export class JoinPageComponent {
  joinForm: FormGroup;

  constructor(
    private chatService: ChatService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.joinForm = this.fb.group({
      roomName: new FormControl('', Validators.required),
      userName: new FormControl('', Validators.required)
    });
  }

  async onSubmit(): Promise<void> {
    if (this.joinForm.valid) {
      const { roomName, userName } = this.joinForm.value;
      this.chatService.setUser(userName);
      this.chatService.setRoom(roomName);
      await this.chatService.joinRoom(userName, roomName);
      this.router.navigate(['/room', roomName]);
    }
  }
}
