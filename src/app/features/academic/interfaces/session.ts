export interface Session { 
  sessionId: number; 
  title: string; 
  scheduledAt: string; 
  durationMinutes: number; 
  embedUrl?: string; 
  status: string; 
  subjectName: string; 
  className: string; 
  teacherName: string;
}