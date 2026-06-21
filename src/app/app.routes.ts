import { Routes } from '@angular/router';
// import { AuthGuard, AdminGuard, TeacherGuard, StudentGuard, SubscriptionGuard } from '../core/guards';

export const routes: Routes = [
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
