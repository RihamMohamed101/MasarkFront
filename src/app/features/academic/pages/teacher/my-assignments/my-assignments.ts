import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClassInfo } from '../../../interfaces/class-info';
import { Subject } from '../../../interfaces/subject';
import { Assignment } from '../../../interfaces/assignment';
import { AcademicService } from '../../../services/academic';

@Component({
  selector: 'app-my-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-assignments.html',
  styleUrl: './my-assignments.css'
})
export class MyAssignments implements OnInit {
  myClasses: ClassInfo[] = [];
  mySubjects: Subject[] = [];
  assignments: Assignment[] = [];

  selectedClassId: number | null = null;
  selectedSubjectId: number | null = null;
  isLoading = false;

  constructor(private academicService: AcademicService) {}

  ngOnInit(): void {
    this.loadTeacherContext();
  }

  // تحميل الفصول والمواد المربوطة بالمدرس ده حالياً
  loadTeacherContext(): void {
    // ملحوظة: الـ ID ده مفروض يجي من الـ Auth Data بعد تسجيل الدخول، هنحطه ثابت مؤقتاً للتجربة
    const currentTeacherId = 'T001'; 

    // هنا الـ API هيرجع الفصول اللي المدرس ده شغال فيها بس
    this.academicService.getClassesByGrade(1, 2026).subscribe({ // مثال مؤقت
      next: (classList) => {
        this.myClasses = classList;
        if (this.myClasses.length > 0) {
          this.selectedClassId = this.myClasses[0].classId;
          this.loadAssignments();
        }
      }
    });

    this.academicService.getSubjectsByGrade(1).subscribe({
      next: (subjectList) => {
        this.mySubjects = subjectList;
        if (this.mySubjects.length > 0) this.selectedSubjectId = this.mySubjects[0].subjectId;
      }
    });
  }

  loadAssignments(): void {
    if (!this.selectedClassId || !this.selectedSubjectId) return;

    this.isLoading = true;
    this.academicService.getAssignments(this.selectedClassId, this.selectedSubjectId).subscribe({
      next: (data) => {
        this.assignments = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}