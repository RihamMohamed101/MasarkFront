export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string; // أو Date
  maxPoints: number;
  classId: number;
  subjectId: number;
  isActive: boolean;
  createdAt?: string;
}