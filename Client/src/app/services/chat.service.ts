import { Injectable } from '@angular/core';
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<{ user: string, message: string }[]>([]);
  private usersSubject = new BehaviorSubject<string[]>([]);

  // Observable streams
  messages$ = this.messagesSubject.asObservable();
  users$ = this.usersSubject.asObservable();

  private hubConnection: HubConnection | null = null;

  constructor() {}

  async joinRoom(user: string, room: string): Promise<void> {
    try {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl("https://localhost:7104/chat")
        .configureLogging(LogLevel.Information)
        .build();

      this.hubConnection.on("ReceiveMessage", (user, message) => {
        const currentMessages = this.messagesSubject.value;
        this.messagesSubject.next([...currentMessages, { user, message }]);
      });

      this.hubConnection.on("UsersInRoom", (users) => {
        this.usersSubject.next(users);
      });

      this.hubConnection.onclose(() => {
        this.hubConnection = null;
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
      if (this.hubConnection) {
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
      }
    } catch (e) {
      console.log(e);
    }
  }
}
