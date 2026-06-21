import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WeeklySchedule } from '../../../interfaces/weekly-schedule';
import { Session } from '../../../interfaces/session';
import { AcademicService } from '../../../services/academic';
@Component({
  selector: 'app-session-scheduler',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-scheduler.html',
  styleUrl: './session-scheduler.css'
})
export class SessionScheduler implements OnInit {
  // كائن الجدول الأسبوعي اللي هيشيل البيانات
  currentWeeklySchedule!: WeeklySchedule;
  
  // قوائم مساعدة للفورم
  myClasses: string[] = ['فصل 1/1', 'فصل 1/2', 'فصل 2/1']; // أمثلة وتقدر تيجي من الـ API
  mySubjects: string[] = ['برمجة بايثون', 'أساسيات الحاسب', 'تطوير الويب'];

  // كائن الحصة الجديدة اللي المدرس هيملا بياناتها
  newSession: Partial<Session> = {
    title: '',
    className: '',
    subjectName: '',
    scheduledAt: '',
    durationMinutes: 45, // قيمة افتراضية لحصة الـ جونيورز
    status: 'Scheduled',
    teacherName: 'أ/ ريهام محمد' // المفروض يجي من الـ Auth
  };

  isLoading = false;

  constructor(private academicService: AcademicService, private router: Router) {}

  ngOnInit(): void {
    this.loadCurrentWeekSchedule();
  }

  // تحميل جدول الأسبوع الحالي
  loadCurrentWeekSchedule(): void {
    this.isLoading = true;
    // نداء الـ API (تقدري تبعتي تاريخ اليوم والـ Backend يحسب الأسبوع)
    this.academicService.getWeeklySchedule('T001').subscribe({
      next: (data: WeeklySchedule) => {
        this.currentWeeklySchedule = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading weekly schedule:', err);
        // بيانات تجريبية (Mock Data) عشان الشاشة ما تضربش لو الـ API لسه مش جاهز
        this.currentWeeklySchedule = {
          weekStart: '2026-06-21',
          weekEnd: '2026-06-27',
          sessions: []
        };
        this.isLoading = false;
      }
    });
  }

  // حفظ وحجز الحصة الجديدة
  saveSession(): void {
    if (!this.newSession.title || !this.newSession.scheduledAt || !this.newSession.className) return;

    this.isLoading = true;
    this.academicService.createSession(this.newSession).subscribe({
      next: (createdSession: Session) => {
        // ضيفي الحصة الجديدة فوراً جوه لستة الأسبوع عشان تظهر في الجدول
        this.currentWeeklySchedule.sessions.push(createdSession);
        
        // ريست للفورم
        this.newSession = {
          title: '',
          className: '',
          subjectName: '',
          scheduledAt: '',
          durationMinutes: 45,
          status: 'Scheduled',
          teacherName: 'أ/ ريهام محمد'
        };
        this.isLoading = false;
        
        // اختياري: لو عايزه ترجعيه لصفحة الجدول الرئيسية بعد الحفظ
        // this.router.navigate(['/teacher/sessions']);
      },
      error: (err) => {
        console.error('Error creating session:', err);
        this.isLoading = false;
      }
    });
  }
}