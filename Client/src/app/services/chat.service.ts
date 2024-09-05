import { Injectable } from '@angular/core';
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<{ user: string, message: string }[]>([]);
  private usersSubject = new BehaviorSubject<string[]>([]);

  private messagesCache: { user: string, message: string }[] = [];
  messages$ = this.messagesSubject.asObservable();
  users$ = this.usersSubject.asObservable();

  private hubConnection: HubConnection | null = null;
  private audio = new Audio('message.mp3');

  constructor() {
    const cachedMessages = sessionStorage.getItem('messages');
    if (cachedMessages) {
      this.messagesCache = JSON.parse(cachedMessages);
      this.messagesSubject.next(this.messagesCache);
    }
  }

  async joinRoom(user: string, room: string): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === HubConnectionState.Connected) {
      console.log('Already connected');
      return;
    }

    try {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl("https://localhost:7104/chat")
        .configureLogging(LogLevel.Information)
        .build();

      this.hubConnection.on("ReceiveMessage", (user, message) => {
        this.messagesCache.push({ user, message });
        sessionStorage.setItem('messages', JSON.stringify(this.messagesCache));
        this.messagesSubject.next(this.messagesCache);
        this.playNotificationSound();
      });

      this.hubConnection.on("UsersInRoom", (users) => {
        this.usersSubject.next(users);
      });

      this.hubConnection.onclose(() => {
        this.hubConnection = null;
        this.messagesCache = [];
        localStorage.removeItem('messages');
        this.messagesSubject.next([]);
        this.usersSubject.next([]);
      });

      await this.hubConnection.start();
      await this.hubConnection.invoke("JoinRoom", { user, room });
    } catch (e) {
      console.log(e);
    }
  }

  async sendMessage(message: string): Promise<void> {
    try {
      if (this.hubConnection && this.hubConnection.state === HubConnectionState.Connected) {
        await this.hubConnection.invoke("SendMessage", message);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async closeConnection(): Promise<void> {
    try {
      if (this.hubConnection) {
        await this.hubConnection.stop();
        this.hubConnection = null;
      }
    } catch (e) {
      console.log(e);
    }
  }

  private playNotificationSound(): void {
    if (document.visibilityState === 'hidden') {
      this.audio.play().catch(error => {
        console.error('Error playing sound', error);
      });
    }
  }
}
