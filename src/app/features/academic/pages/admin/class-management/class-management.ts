import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Grade } from '../../../interfaces/grade';
import { ClassInfo } from '../../../interfaces/class-info';
import { AcademicService } from '../../../services/academic';


@Component({
  selector: 'app-class-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './class-management.html',
  styleUrl: './class-management.css'
})
export class ClassManagement implements OnInit {
  grades: Grade[] = [];
  classes: ClassInfo[] = [];
  selectedGradeId: number | null = null;
  selectedYear: number = 2026; // السنة الحالية تلقائياً
  isLoadingGrades = false;
  isLoadingClasses = false;

  // كائن الفصل الجديد
  newClass: Partial<ClassInfo> = {
    name: '',
    gradeId: 0,
    academicYear: 2026,
    maxCapacity: 30, // قيمة افتراضية اختيارية لسعة الفصل
    isActive: true
  };

  constructor(private academicService: AcademicService) {}

  ngOnInit(): void {
    this.loadGrades();
  }

  // تحميل المراحل الدراسية للـ Dropdown
  loadGrades(): void {
    this.isLoadingGrades = true;
    this.academicService.getAllGrades().subscribe({
      next: (data) => {
        this.grades = data.filter(g => g.isActive);
        this.isLoadingGrades = false;
        if (this.grades.length > 0) {
          this.selectedGradeId = this.grades[0].gradeId;
          this.loadClasses();
        }
      },
      error: (err) => {
        console.error('Error loading grades:', err);
        this.isLoadingGrades = false;
      }
    });
  }

  // عند تغيير الفلتر (المرحلة أو السنة)
  onFilterChange(): void {
    this.loadClasses();
  }

  // تحميل الفصول بناءً على الفلاتر المحددة
  loadClasses(): void {
    if (!this.selectedGradeId) return;

    this.isLoadingClasses = true;
    this.academicService.getClassesByGrade(this.selectedGradeId, this.selectedYear).subscribe({
      next: (data) => {
        this.classes = data;
        this.isLoadingClasses = false;
      },
      error: (err) => {
        console.error('Error loading classes:', err);
        this.isLoadingClasses = false;
      }
    });
  }

  // إضافة فصل جديد
  addClass(): void {
    if (!this.newClass.name || !this.selectedGradeId) return;

    // ربط الفصل بالمرحلة والسنة المختارة حالياً
    this.newClass.gradeId = this.selectedGradeId;
    this.newClass.academicYear = this.selectedYear;

    this.academicService.createClass(this.newClass).subscribe({
      next: (createdClass) => {
        this.classes.push(createdClass); // تحديث الجدول فوراً
        // إعادة تهيئة اسم الفصل فقط مع الاحتفاظ بباقي الإعدادات
        this.newClass.name = '';
      },
      error: (err) => console.error('Error creating class:', err)
    });
  }
}