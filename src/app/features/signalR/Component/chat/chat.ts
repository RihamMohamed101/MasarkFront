import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../../core/services/signalr';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
})
export class ChatComponent implements OnInit, OnDestroy {
  chatService = inject(ChatService);

  roomId: number = 1; // يمكن جعلها ديناميكية بناءً على اختيار المستخدم
  newMessageContent: string = '';
  currentUser: string = ' '; // في الشاشة التانية غيريها لـ 'UserB'

  ngOnInit(): void {
    //  هعملها من login  بعد كده لا تنسي
    this.currentUser =
      prompt('من فضلك أدخل اسمك للدردشة:') || 'User_' + Math.floor(Math.random() * 1000);
    // 1. بدء الاتصال عند تحميل المكون
    this.chatService.startConnection();

    // 2. تأخير بسيط لضمان فتح الاتصال قبل الانضمام للغرفة
    setTimeout(() => {
      this.chatService.joinRoom(this.roomId);
      this.chatService.loadMessageHistory(this.roomId);
    }, 1000);
  }

  ngOnDestroy(): void {
    // مغادرة الغرفة عند الخروج من الصفحة
    this.chatService.leaveRoom(this.roomId);
  }

  sendMessage(): void {
    if (!this.newMessageContent.trim()) return;

    this.chatService.sendMessage({
      roomId: this.roomId,
      senderName: this.currentUser, // إرسال اسم المستخدم مع الرسالة
      content: this.newMessageContent,
    });

    this.newMessageContent = ''; // تفريغ حقل الإدخال
  }
}
