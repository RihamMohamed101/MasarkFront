import { Routes } from '@angular/router';
import { Chat } from './features/signalR/Component/chat/chat';
import { Landing } from './features/landing/landing';
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
import { guestGuard } from './core/guards/guest-guard-guard';
// import { AuthGuard, AdminGuard, TeacherGuard, StudentGuard, SubscriptionGuard } from '../core/guards';

export const routes: Routes = [
  {
    path: '',
    component: Landing,
    pathMatch: 'full',
  },

  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/signup/signup').then((m) => m.Signup),
      },
      {
        path: 'ChangePassword',
        loadComponent: () =>
          import('./features/auth/change-password-component/change-password-component').then(
            (m) => m.ChangePasswordComponent,
          ),
      },

      {
        path: 'ForgotPassword',
        loadComponent: () =>
          import('./features/auth/forgot-password-component/forgot-password-component').then(
            (m) => m.ForgotPasswordComponent,
          ),
      },

      {
        path: 'ResetPassword',
        loadComponent: () =>
          import('./features/auth/reset-password-component/reset-password-component').then(
            (m) => m.ResetPasswordComponent,
          ),
      },
    ],
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
  {
    path: 'chat',
    component: Chat,
  },

  {
    path: 'plans',
    loadComponent: () =>
      import('./features/subscription/components/plans-component/plans-component').then(
        (m) => m.PlansComponent,
      ),
  },

  {
    path: 'my-subscription',
    loadComponent: () =>
      import('./features/subscription/components/my-subscription-component/my-subscription-component').then(
        (m) => m.MySubscriptionComponent,
      ),
  },

  {
    path: 'checkout-success',
    loadComponent: () =>
      import('./features/subscription/components/checkout-success-component/checkout-success-component').then(
        (m) => m.CheckoutSuccessComponent,
      ),
  },

  {
    path: 'checkout-cancel',
    loadComponent: () =>
      import('./features/subscription/components/checkout-cancel-component/checkout-cancel-component').then(
        (m) => m.CheckoutCancelComponent,
      ),
  },
];
