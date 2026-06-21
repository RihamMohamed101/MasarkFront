import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Grade } from '../../../interfaces/grade';
import { AcademicService } from '../../../services/academic';

@Component({
  selector: 'app-grade-management',
  standalone: true,
  imports: [CommonModule, FormsModule], // بنعمل استيراد للـ Directives الأساسية والفورمز
  templateUrl: './grade-management.html',
})
export class GradeManagement implements OnInit {
  grades: Grade[] = [];
  isLoading = false;

  newGrade: Partial<Grade> = {
    name: '',
    nameAr: '',
    stage: 'Primary',
    order: 1,
    isActive: true,
  };

  constructor(private academicService: AcademicService) {}

  ngOnInit(): void {
    this.loadGrades();
  }

  // جلب البيانات من الـ API
  loadGrades(): void {
    this.isLoading = true;
    this.academicService.getAllGrades().subscribe({
      next: (data) => {
        console.log(data);
        this.grades = data;
        console.log('grades => ', this.grades);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching grades:', err);
        this.isLoading = false;
      },
    });
  }

  // إضافة مرحلة جديدة
  addGrade(): void {
    if (!this.newGrade.name || !this.newGrade.nameAr) return;

    this.academicService.createGrade(this.newGrade).subscribe({
      next: (createdGrade) => {
        this.grades.push(createdGrade); // ضيفيها في اللستة علطول عشان الـ UI يتحدث
        this.grades.sort((a, b) => a.order - b.order);

        // إعادة تهيئة الفورم
        this.newGrade = {
          name: '',
          nameAr: '',
          stage: 'Primary',
          order: this.grades.length + 1,
          isActive: true,
        };
      },
      error: (err) => console.error('Error creating grade:', err),
    });
  }
}
