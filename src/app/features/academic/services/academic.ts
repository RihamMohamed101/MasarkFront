import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Grade } from '../interfaces/grade';
import { Subject } from '../interfaces/subject';
import { ClassInfo } from '../interfaces/class-info';
import { environment } from '../../../../environments/environment';
import { Assignment } from '../interfaces/assignment';
import { Session } from '../interfaces/session';

import { WeeklySchedule } from '../interfaces/weekly-schedule';

@Injectable({
  providedIn: 'root',
})
export class AcademicService {
  private apiUrl = `${environment.apiUrl}/api/admin`; // المسار الأساسي للأدمن في الـ API

  constructor(private http: HttpClient) {}

 
  // ========
  // ==================================
  // 1. إدارة المراحل الدراسية (Grades)
  // ==========================================
  getAllGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/grades`);
  }

    createGrade(grade: Partial<Grade>): Observable<Grade> {
      return this.http.post<Grade>(`${this.apiUrl}/grades`, grade);
    }

    updateGrade(id: number, grade: Partial<Grade>): Observable<Grade> {
      return this.http.put<Grade>(`${this.apiUrl}/grades/${id}`, grade);
    }

    // ==========================================
    // 2. إدارة المواد الدراسية (Subjects)
    // ==========================================
    getSubjectsByGrade(gradeId: number): Observable<Subject[]> {
      return this.http.get<Subject[]>(`${this.apiUrl}/grades/${gradeId}/subjects`);
    }

    createSubject(subject: Partial<Subject>): Observable<Subject> {
      return this.http.post<Subject>(`${this.apiUrl}/subjects`, subject);
    }

    // ==========================================
    // 3. إدارة الفصول (Classes)
    // ==========================================
    getClassesByGrade(gradeId: number, academicYear: number): Observable<ClassInfo[]> {
      return this.http.get<ClassInfo[]>(
        `${this.apiUrl}/grades/${gradeId}/classes?academicYear=${academicYear}`,
      );
    }



    createClass(classData: Partial<ClassInfo>): Observable<ClassInfo> {
      return this.http.post<ClassInfo>(`${this.apiUrl}/classes`, classData);
    }

    // ==========================================
  // 4. إدارة الواجبات (Assignments)
  // ==========================================
  getAssignments(classId: number, subjectId: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/assignments?classId=${classId}&subjectId=${subjectId}`);
  }

  createAssignment(assignment: Partial<Assignment>): Observable<Assignment> {
    return this.http.post<Assignment>(`${this.apiUrl}/assignments`, assignment);
  }

  // ==========================================
  // 6. إدارة الحصص والمحاضرات (Sessions)
  // ==========================================
  getTeacherSessions(teacherId: string): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/sessions?teacherId=${teacherId}`);
  }

  createSession(session: Partial<Session>): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/sessions`, session);
  }

  getWeeklySchedule(teacherId: string): Observable<WeeklySchedule> {
    return this.http.get<WeeklySchedule>(`${this.apiUrl}/sessions/weekly?teacherId=${teacherId}`);
  }
}
