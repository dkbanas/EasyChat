import { Injectable } from '@angular/core';
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<{ user: string, message: string }[]>([]);
  private usersSubject = new BehaviorSubject<string[]>([]);

  private _username: string | null = null;
  private _roomName: string | null = null;
  // Observable streams
  messages$ = this.messagesSubject.asObservable();
  users$ = this.usersSubject.asObservable();

  private hubConnection: HubConnection | null = null;

  constructor() {}

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
        this.hubConnection = null; // Ensure hubConnection is set to null after stopping
      }
    } catch (e) {
      console.log(e);
    }
  }

  setUser(username: string): void {
    this._username = username;
  }

  getUser(): string | null {
    return this._username;
  }

  setRoom(roomName: string): void {
    this._roomName = roomName;
  }

  getRoom(): string | null {
    return this._roomName;
  }
}
