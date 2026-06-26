import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SubscriptionApiService } from '../../../../core/services/subscription-api-service';
import { PlanDto, SubscriptionDto } from '../../../../core/models/subscription.model';
import { AuthStateService } from '../../../../core/services/auth-state-service';
import { AdminApiService, AdminUserDto } from '../../../../core/services/admin-api-service';
import { forkJoin } from 'rxjs';
import { catchError, of } from 'rxjs';

// Unified user model used throughout this component
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  joinedAt: string;
  /** 'api' = came from backend, 'manual' = admin-added locally */
  source: 'api' | 'manual';
  subscription?: {
    planName: string;
    planType: string;
    status: string;
    endDate: string;
  } | null;
}

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  private readonly subApi = inject(SubscriptionApiService);
  private readonly authState = inject(AuthStateService);
  private readonly adminApi = inject(AdminApiService);

  private readonly usersStorageKey = 'masarak_admin_users_v2';
  private readonly subscriptionsStorageKey = 'masarak_student_subscriptions';

  // ── State signals ─────────────────────────────────────────────────────────
  users = signal<AdminUser[]>([]);
  plans = signal<PlanDto[]>([]);
  allSubscriptions = signal<SubscriptionDto[]>([]);

  selectedUser = signal<AdminUser | null>(null);
  isEditing = signal(false);
  showAddModal = signal(false);

  selectedPlanId = signal<number | null>(null);
  selectedStudentId = signal<number | null>(null);
  assigning = signal(false);

  feedback = signal<string | null>(null);
  feedbackType = signal<'success' | 'error'>('success');

  isLoadingUsers = signal(true);
  activeTab = signal<'users' | 'subscriptions'>('users');
  private readonly _searchQuery = signal('');
  private readonly _roleFilter = signal('');

  get searchQuery(): string { return this._searchQuery(); }
  set searchQuery(v: string) { this._searchQuery.set(v); }
  get roleFilter(): string { return this._roleFilter(); }
  set roleFilter(v: string) { this._roleFilter.set(v); }

  // ── Form ──────────────────────────────────────────────────────────────────
  form = {
    name: '',
    email: '',
    role: 'Student',
    status: 'Active' as 'Active' | 'Inactive',
  };

  // ── Computed ──────────────────────────────────────────────────────────────
  studentUsers = computed(() => this.users().filter((u) => u.role === 'Student'));

  filteredUsers = computed(() => {
    const q = this._searchQuery().toLowerCase().trim();
    const role = this._roleFilter();
    return this.users().filter((u) => {
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole = !role || u.role === role;
      return matchQ && matchRole;
    });
  });

  totalStudents = computed(() => this.users().filter((u) => u.role === 'Student').length);
  totalTeachers = computed(() => this.users().filter((u) => u.role === 'Teacher').length);
  totalSubscribed = computed(() => this.users().filter((u) => u.subscription?.status === 'Active').length);


  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoadingUsers.set(true);

    forkJoin({
      plans: this.subApi.getPlans().pipe(catchError(() => of([] as PlanDto[]))),
      apiUsers: this.adminApi.getUsers().pipe(
        catchError((err) => {
          console.error('Failed to fetch users from backend API (/api/admin/users):', err);
          return of([] as AdminUserDto[]);
        }),
      ),
      allSubs: this.subApi
        .getAllSubscriptions({ pageNumber: 1, pageSize: 200 })
        .pipe(catchError(() => of({ items: [] as SubscriptionDto[] } as any))),
    }).subscribe(({ plans, apiUsers, allSubs }) => {
      this.plans.set(plans);

      const subItems: SubscriptionDto[] = Array.isArray(allSubs)
        ? allSubs
        : allSubs?.items ?? [];
      this.allSubscriptions.set(subItems);

      // Build subscription lookup by userId
      const subMap = new Map<number, SubscriptionDto>();
      subItems.forEach((s) => subMap.set(s.userId, s));

      // Normalise API users
      const rawApiUsers: AdminUserDto[] = Array.isArray(apiUsers)
        ? apiUsers
        : (apiUsers as any)?.items ?? [];

      const apiMapped: AdminUser[] = rawApiUsers.map((u) => ({
        id: u.userId,
        name: u.fullName || u.email,
        email: u.email,
        role: u.role,
        status: u.isActive ? 'Active' : 'Inactive',
        joinedAt: this.formatDate(u.createdAt),
        source: 'api',
        subscription: this.mapSub(subMap.get(u.userId)),
      }));

      // Load locally-added manual users
      const manualUsers = this.loadManualUsers();

      // Merge: API wins for same id
      const apiIds = new Set(apiMapped.map((u) => u.id));
      const mergedManual = manualUsers.filter((u) => !apiIds.has(u.id));

      // Also sync current logged-in user
      const currentUser = this.authState.user();
      if (currentUser && !apiIds.has(currentUser.userId)) {
        const mapped: AdminUser = {
          id: currentUser.userId,
          name: currentUser.fullName || currentUser.email,
          email: currentUser.email,
          role: currentUser.role,
          status: currentUser.isActive ? 'Active' : 'Inactive',
          joinedAt: this.formatDate(currentUser.createdAt),
          source: 'api',
          subscription: this.mapSub(subMap.get(currentUser.userId)),
        };
        apiMapped.push(mapped);
      }

      const merged = [...apiMapped, ...mergedManual];
      this.users.set(merged);
      this.isLoadingUsers.set(false);
    });
  }

  private mapSub(sub?: SubscriptionDto): AdminUser['subscription'] {
    if (!sub) return null;
    return {
      planName: sub.planName,
      planType: sub.planType,
      status: sub.status,
      endDate: sub.endDate,
    };
  }

  // ── Manual users storage ──────────────────────────────────────────────────
  private loadManualUsers(): AdminUser[] {
    try {
      const raw = localStorage.getItem(this.usersStorageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as AdminUser[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persistManualUsers(): void {
    const manual = this.users().filter((u) => u.source === 'manual');
    localStorage.setItem(this.usersStorageKey, JSON.stringify(manual));
  }

  // ── Modal helpers ─────────────────────────────────────────────────────────
  openAddModal(): void {
    this.form = { name: '', email: '', role: 'Student', status: 'Active' };
    this.selectedUser.set(null);
    this.isEditing.set(false);
    this.showAddModal.set(true);
    this.feedback.set(null);
  }

  openEditModal(user: AdminUser): void {
    this.selectedUser.set(user);
    this.form = { name: user.name, email: user.email, role: user.role, status: user.status };
    this.isEditing.set(true);
    this.showAddModal.set(true);
    this.feedback.set(null);
  }

  closeModal(): void {
    this.showAddModal.set(false);
    this.selectedUser.set(null);
    this.isEditing.set(false);
    this.feedback.set(null);
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────
  saveUser(): void {
    const trimmedName = this.form.name.trim();
    if (!trimmedName) {
      this.setFeedback('يرجى إدخال اسم المستخدم', 'error');
      return;
    }

    const normalizedName = trimmedName.toLowerCase();
    const isDuplicate = this.users().some((u) => {
      const same = u.name.toLowerCase() === normalizedName;
      return this.isEditing() ? same && u.id !== this.selectedUser()?.id : same;
    });

    if (isDuplicate) {
      this.setFeedback('هذا المستخدم موجود بالفعل', 'error');
      return;
    }

    if (this.isEditing()) {
      this.users.update((list) =>
        list.map((u) =>
          u.id === this.selectedUser()?.id
            ? { ...u, name: trimmedName, email: this.form.email, role: this.form.role, status: this.form.status }
            : u,
        ),
      );
    } else {
      const next: AdminUser = {
        id: Date.now(),
        name: trimmedName,
        email: this.form.email,
        role: this.form.role,
        status: this.form.status,
        joinedAt: new Date().toLocaleDateString('en-GB'),
        source: 'manual',
        subscription: null,
      };
      this.users.update((list) => [next, ...list]);
    }

    this.persistManualUsers();
    this.setFeedback(this.isEditing() ? 'تم تعديل المستخدم بنجاح' : 'تمت إضافة المستخدم بنجاح');
    setTimeout(() => this.closeModal(), 900);
  }

  deleteUser(id: number): void {
    this.users.update((list) => list.filter((u) => u.id !== id));
    this.persistManualUsers();
  }

  // ── Subscription assignment ────────────────────────────────────────────────
  assignSubscription(): void {
    const studentId = this.selectedStudentId();
    if (!studentId) { this.setFeedback('اختر طالبًا أولاً', 'error'); return; }
    if (!this.selectedPlanId()) { this.setFeedback('اختر خطة أولاً', 'error'); return; }

    this.assigning.set(true);
    this.setFeedback(null);

    const student = this.studentUsers().find((u) => u.id === studentId);
    const plan = this.plans().find((p) => p.planId === this.selectedPlanId());
    const note = `Assigned from admin panel for ${student?.name ?? 'student'}`;

    this.subApi
      .adminActivate({ studentUserId: studentId, planId: this.selectedPlanId()!, note })
      .subscribe({
        next: () => {
          this.assigning.set(false);
          if (student && plan) {
            const now = new Date();
            const end = new Date(now);
            end.setDate(end.getDate() + (plan.durationDays || 30));

            this.users.update((list) =>
              list.map((u) =>
                u.id === studentId
                  ? { ...u, subscription: { planName: plan.name, planType: plan.type, status: 'Active', endDate: end.toISOString() } }
                  : u,
              ),
            );
          }
          this.setFeedback(`تمت إضافة الاشتراك للطالب ${student?.name ?? 'المحدد'}`);
          this.selectedStudentId.set(null);
          this.selectedPlanId.set(null);
        },
        error: () => {
          this.assigning.set(false);
          this.setFeedback('تعذر إضافة الاشتراك. تأكد من صلاحية الطالب أو الخطة.', 'error');
        },
      });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private setFeedback(msg: string | null, type: 'success' | 'error' = 'success'): void {
    this.feedback.set(msg);
    this.feedbackType.set(type);
  }

  private formatDate(value: string): string {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB');
  }

  subStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'badge-active';
      case 'Expired': return 'badge-expired';
      case 'Cancelled': return 'badge-cancelled';
      default: return 'badge-pending';
    }
  }

  subStatusLabel(status: string): string {
    const map: Record<string, string> = {
      Active: 'نشط', Expired: 'منتهي', Cancelled: 'ملغى', Pending: 'معلق',
    };
    return map[status] ?? status;
  }

  planTypeLabel(type: string): string {
    const map: Record<string, string> = {
      Monthly: 'شهري', PerSubject: 'لكل مادة', FullCurriculum: 'المنهج الكامل',
    };
    return map[type] ?? type;
  }

  roleLabel(role: string): string {
    const map: Record<string, string> = {
      Student: 'طالب', Teacher: 'معلم', Admin: 'مدير', Parent: 'ولي أمر',
    };
    return map[role] ?? role;
  }

  roleClass(role: string): string {
    switch (role) {
      case 'Student': return 'role-student';
      case 'Teacher': return 'role-teacher';
      case 'Admin': return 'role-admin';
      default: return 'role-parent';
    }
  }
}
