export interface Message {
  id?: number;
  roomId: number;
  
senderName: string; // <-- الحقل الجديد
  content: string;
  createdAt: Date;
}