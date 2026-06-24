import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayoutComponent implements OnInit {
  // المتغيرات دي في الشغل الحقيقي هنجيبها من الـ AuthService
  userRole: string = 'teacher'; // ممكن تكون 'student' أو 'teacher' أو 'admin'
  userName: string = 'محمد أحمد';
  userAvatar: string = 'assets/student-avatar.jpg';
  userRoleDisplay: string = 'الصف العاشر';

  ngOnInit(): void {
    // هنا مستقبلاً هتعملي تواصل مع الـ API عشان تعرفي الـ Role الحقيقي
    // وبناءً عليه تحددي الـ userRole والبيانات اللي فوق
  }
}
