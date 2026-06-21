import { Component, OnInit } from '@angular/core';
import { Session } from '../../../interfaces/session';
import { AcademicService } from '../../../services/academic';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-sessions',
  imports: [CommonModule],
  templateUrl: './my-sessions.html',
  styleUrl: './my-sessions.css',
})



export class MySessions implements OnInit {
  sessions: Session[] = [];
  isLoading = false;

  constructor(private academicService: AcademicService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.isLoading = true;
    const currentTeacherId = 'T001'; // المعرف التجريبي للمدرس

    // نداء الـ API مع ضبط الـ Type ليكون Session[]
    this.academicService.getTeacherSessions(currentTeacherId).subscribe({
      next: (data: Session[]) => {
        this.sessions = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading sessions:', err);
        this.isLoading = false;
      }
    });
  }
}