import { Session } from './session';

export interface WeeklySchedule {
  weekStart: string;
  weekEnd: string;
  sessions: Session[];
}
