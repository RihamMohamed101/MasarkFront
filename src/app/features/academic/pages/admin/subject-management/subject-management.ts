import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Grade } from '../../../interfaces/grade';
import { Subject } from '../../../interfaces/subject';
import { AcademicService } from '../../../services/academic';

@Component({
  selector: 'app-subject-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subject-management.html',
  styleUrl: './subject-management.css'
})
export class SubjectManagement implements OnInit {
  grades: Grade[] = [];
  subjects: Subject[] = [];
  selectedGradeId: number | null = null;
  isLoadingGrades = false;
  isLoadingSubjects = false;

  // كائن المادة الجديدة
  newSubject: Partial<Subject> = {
    name: '',
    nameAr: '',
    code: '',
    gradeId: 0
  };

  constructor(private academicService: AcademicService) {}

  ngOnInit(): void {
    this.loadGrades();
  }

  // تحميل المراحل الدراسية عشان نعرضها في الـ Dropdown
  loadGrades(): void {
    this.isLoadingGrades = true;
    this.academicService.getAllGrades().subscribe({
      next: (data) => {
        this.grades = data.filter(g => g.isActive);
        this.isLoadingGrades = false;
        // لو فيه مراحل، اختاري أول واحدة تلقائياً وحملي موادها
        if (this.grades.length > 0) {
          this.selectedGradeId = this.grades[0].gradeId;
          this.loadSubjects(this.selectedGradeId);
        }
      },
      error: (err) => {
        console.error('Error loading grades:', err);
        this.isLoadingGrades = false;
      }
    });
  }

  onGradeChange(): void {
    if (this.selectedGradeId) {
      this.loadSubjects(this.selectedGradeId);
    }
  }

  loadSubjects(gradeId: number): void {
    this.isLoadingSubjects = true;
    this.academicService.getSubjectsByGrade(gradeId).subscribe({
      next: (data) => {
        this.subjects = data;
        this.isLoadingSubjects = false;
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
        this.isLoadingSubjects = false;
      }
    });
  }

  // إضافة مادة جديدة
  addSubject(): void {
    if (!this.newSubject.name || !this.newSubject.nameAr || !this.selectedGradeId) return;

    this.newSubject.gradeId = this.selectedGradeId;

    this.academicService.createSubject(this.newSubject).subscribe({
      next: (createdSubject) => {
        this.subjects.push(createdSubject); // تحديث القائمة فوراً
        // إعادة تهيئة الفورم
        this.newSubject = { name: '', nameAr: '', code: '', gradeId: this.selectedGradeId! };
      },
      error: (err) => console.error('Error creating subject:', err)
    });
  }
}