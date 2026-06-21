import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Grade } from '../../../interfaces/grade';
import { ClassInfo } from '../../../interfaces/class-info';
import { Subject } from '../../../interfaces/subject';
import { Assignment } from '../../../interfaces/assignment';
import { AcademicService } from '../../../services/academic';

@Component({
  selector: 'app-assignment-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignment-management.html',
  styleUrl: './assignment-management.css'
})
export class AssignmentManagement implements OnInit {
  grades: Grade[] = [];
  classes: ClassInfo[] = [];
  subjects: Subject[] = [];
  assignments: Assignment[] = [];

  // الفلاتر المختارة
  selectedGradeId: number | null = null;
  selectedClassId: number | null = null;
  selectedSubjectId: number | null = null;

  isLoading = false;

  // كائن الواجب الجديد
  newAssignment: Partial<Assignment> = {
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 10, // درجة افتراضية
    isActive: true
  };

  constructor(private academicService: AcademicService) {}

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {
    this.academicService.getAllGrades().subscribe({
      next: (data) => {
        this.grades = data.filter(g => g.isActive);
        if (this.grades.length > 0) {
          this.selectedGradeId = this.grades[0].gradeId;
          this.onGradeChange();
        }
      }
    });
  }

  // عند تغيير المرحلة، نشحن الفصول والمواد الخاصة بها فوراً
  onGradeChange(): void {
    if (!this.selectedGradeId) return;

    this.classes = [];
    this.subjects = [];
    this.assignments = [];
    this.selectedClassId = null;
    this.selectedSubjectId = null;

    // 1. تحميل الفصول (افتراضياً لسنة 2026)
    this.academicService.getClassesByGrade(this.selectedGradeId, 2026).subscribe({
      next: (classList) => {
        this.classes = classList;
        if (this.classes.length > 0) this.selectedClassId = this.classes[0].classId;
        this.checkAndLoadAssignments();
      }
    });

    // 2. تحميل المواد
    this.academicService.getSubjectsByGrade(this.selectedGradeId).subscribe({
      next: (subjectList) => {
        this.subjects = subjectList;
        if (this.subjects.length > 0) this.selectedSubjectId = this.subjects[0].subjectId;
        this.checkAndLoadAssignments();
      }
    });
  }

  // دالة مساعدة للتأكد من اختيار الفصل والمادة قبل مناداة الـ API
  checkAndLoadAssignments(): void {
    if (this.selectedClassId && this.selectedSubjectId) {
      this.loadAssignments();
    }
  }

  loadAssignments(): void {
    this.isLoading = true;
    this.academicService.getAssignments(this.selectedClassId!, this.selectedSubjectId!).subscribe({
      next: (data) => {
        this.assignments = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  addAssignment(): void {
    if (!this.newAssignment.title || !this.selectedClassId || !this.selectedSubjectId) return;

    this.newAssignment.classId = this.selectedClassId;
    this.newAssignment.subjectId = this.selectedSubjectId;

    this.academicService.createAssignment(this.newAssignment).subscribe({
      next: (created) => {
        this.assignments.push(created);
        // ريست للفورم
        this.newAssignment = { title: '', description: '', dueDate: '', maxPoints: 10, isActive: true };
      },
      error: (err) => console.error('Error creating assignment:', err)
    });
  }
}