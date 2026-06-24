export interface SendMessageDto {
  roomId: number;
  senderName: string; // <-- الحقل الجديد
  content: string;
}