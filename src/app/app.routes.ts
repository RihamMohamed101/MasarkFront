import { Routes } from '@angular/router';
import { ChatComponent } from './features/signalR/Component/chat/chat';
import { Landing } from './features/landing/landing';
import { Login } from './features/auth/login/login';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout';
import { AdminComponent } from './features/admin/adminComponent/admin';
import { TeacherComponent } from './features/teacher/teacherComponent/teacher';
import { Courses } from './features/student/components/courses/courses';
import { StudentComponent } from './features/student/studentComponent/student';
import { TeacherCourses } from './features/teacher/components/teacher-courses/teacher-courses';
import { UserManagement } from './features/admin/components/user-management/user-management';
import { TeacherStudents } from './features/teacher/components/teacher-students/teacher-students';
import { TeacherAssignments } from './features/teacher/components/teacher-assignments/teacher-assignments';
import { LessonLibrary } from './features/student/components/lesson-library/lesson-library';
import { StudentAssignments } from './features/student/components/student-assignments/student-assignments';
// import { AuthGuard, AdminGuard, TeacherGuard, StudentGuard, SubscriptionGuard } from '../core/guards';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
    pathMatch: 'full',
  },

  {
    path: 'dashboard',
    component: DashboardLayoutComponent, // الشاسيه الثابت
    children: [
      {
        path: 'student',
        children: [
          { path: '', component: StudentComponent },
          // يفتح لوحة التحكم على رابط: dashboard/student
          { path: 'courses', component: Courses },

          { path: 'library', component: LessonLibrary },

          { path: 'assignments', component: StudentAssignments },
        ],
      }, // محتوى الطالب
      {
        path: 'teacher',
        children: [
          { path: '', component: TeacherComponent },
          { path: 'courses', component: TeacherCourses },
          { path: 'students', component: TeacherStudents },
          { path: 'assignments', component: TeacherAssignments },
        ],
      }, // محتوى المدرس
      {
        path: 'admin',
        children: [
          { path: '', component: AdminComponent },

          { path: 'users', component: UserManagement },
        ],
      }, // محتوى المدير
    ],
  },

  { path: 'login', component: Login },
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'admin/grades',
    loadComponent: () =>
      import('./features/academic/pages/admin/grade-management/grade-management').then(
        (c) => c.GradeManagement,
      ),
    // canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/classes',
    loadComponent: () =>
      import('./features/academic/pages/admin/class-management/class-management').then(
        (c) => c.ClassManagement,
      ),
    // canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/subjects',
    loadComponent: () =>
      import('./features/academic/pages/admin/subject-management/subject-management').then(
        (c) => c.SubjectManagement,
      ),
    // canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/assignments',
    loadComponent: () =>
      import('./features/academic/pages/admin/assignment-management/assignment-management').then(
        (c) => c.AssignmentManagement,
      ),
    // canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: 'teacher/assignments',
    loadComponent: () =>
      import('./features/academic/pages/teacher/my-assignments/my-assignments').then(
        (c) => c.MyAssignments,
      ),
    // canActivate: [AuthGuard, TeacherGuard]
  },
  {
    path: 'teacher/sessions',
    loadComponent: () =>
      import('./features/academic/pages/teacher/my-sessions/my-sessions').then((c) => c.MySessions),
    // canActivate: [AuthGuard, TeacherGuard]
  },
  {
    path: 'teacher/sessions/new',
    loadComponent: () =>
      import('./features/academic/pages/teacher/session-scheduler/session-scheduler').then(
        (c) => c.SessionScheduler,
      ),
    // canActivate: [AuthGuard, TeacherGuard]
  },

  // ==========================================
  // Student Routes (مسارات الطالب)
  // ==========================================
  {
    path: 'student/schedule',
    loadComponent: () =>
      import('./features/academic/pages/student/my-schedule/my-schedule').then((c) => c.MySchedule),
    // canActivate: [AuthGuard, StudentGuard, SubscriptionGuard]
  },
  {
    path: 'student/my-class',
    loadComponent: () =>
      import('./features/academic/pages/student/my-class/my-class').then((c) => c.MyClass),
    // canActivate: [AuthGuard, StudentGuard, SubscriptionGuard]
  },
];
