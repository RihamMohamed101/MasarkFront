import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { Message } from '../../features/signalR/models/message';
import { SendMessageDto } from '../../features/signalR/models/SendMessageDto';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;

  private baseUrl = 'https://localhost:7175';

  public messages = signal<Message[]>([]);

  constructor(private http: HttpClient) {}

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/chathub`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('تم الاتصال بنجاح مع SignalR Hub'))
      .catch((err) => {
        console.error('فشل الاتصال بالخادم، يرجى التأكد من عمل الـ Backend:', err);
      });

    this.hubConnection.on('MessageReceived', (message: Message) => {
      this.messages.update((currentMessages) => [...currentMessages, message]);
    });
  }

  public joinRoom(roomId: number): void {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection
        .invoke('JoinRoom', roomId.toString())
        .catch((err) => console.error('خطأ أثناء الانضمام للغرفة:', err));
    }
  }

  public leaveRoom(roomId: number): void {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection
        .invoke('LeaveRoom', roomId.toString())
        .catch((err) => console.error('خطأ أثناء مغادرة الغرفة:', err));
    }
  }

  public loadMessageHistory(roomId: number): void {
    this.http.get<Message[]>(`${this.baseUrl}/api/chat/${roomId}`).subscribe({
      next: (history) => this.messages.set(history),
      error: (err) => console.error('خطأ في جلب الرسائل:', err),
    });
  }

  public sendMessage(dto: SendMessageDto): void {
    this.http.post<Message>(`${this.baseUrl}/api/chat`, dto).subscribe({
      error: (err) => console.error('خطأ في إرسال الرسالة:', err),
    });
  }
}
