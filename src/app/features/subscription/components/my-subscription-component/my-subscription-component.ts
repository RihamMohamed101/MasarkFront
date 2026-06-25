import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionApiService } from '../../../../core/services/subscription-api-service';
import { AuthApiService } from '../../../../core/services/auth-api-service';
import { AuthStateService } from '../../../../core/services/auth-state-service';
import { SubscriptionDto, SubscriptionStatusResponse } from '../../../../core/models/subscription.model';

@Component({
  selector: 'my-subscription-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-subscription-component.html',
})

export class MySubscriptionComponent implements OnInit {
  private subApi  = inject(SubscriptionApiService);
  private authApi = inject(AuthApiService);
  readonly auth   = inject(AuthStateService);

  status         = signal<SubscriptionStatusResponse | null>(null);
  history        = signal<SubscriptionDto[]>([]);
  loading        = signal(true);
  historyLoading = signal(true);
  error          = signal<string | null>(null);
  linkageCode    = signal<string | null>(null);
  codeLoading    = signal(false);
  codeError      = signal<string | null>(null);
  copied         = signal(false);

  ngOnInit(): void {
    this.loadStatus();
    this.loadHistory();
    if (this.auth.isStudent()) this.loadLinkageCode();
  }

  loadStatus(): void {
    this.loading.set(true);
    this.subApi.getMySubscriptionStatus().subscribe({
      next:  res => { this.status.set(res); this.loading.set(false); },
      error: err => {
        this.error.set(err?.error?.message ?? 'Failed to load subscription.');
        this.loading.set(false);
      },
    });
  }

  loadHistory(): void {
    this.historyLoading.set(true);
    this.subApi.getMyHistory().subscribe({
      next:  h  => { this.history.set(h); this.historyLoading.set(false); },
      error: () => this.historyLoading.set(false),
    });
  }

  loadLinkageCode(): void {
    this.codeLoading.set(true);
    this.authApi.getMyLinkageCode().subscribe({
      next:  r   => { this.linkageCode.set(r.code); this.codeLoading.set(false); },
      error: err => {
        this.codeError.set(err?.error?.message ?? 'Could not load linkage code.');
        this.codeLoading.set(false);
      },
    });
  }

  copyCode(): void {
    const code = this.linkageCode();
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  daysLeft(endDate: string): number {
    const diff = new Date(endDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  daysLeftClass(endDate: string): string {
    const d = this.daysLeft(endDate);
    if (d <= 7)  return 'text-xs text-danger font-medium';
    if (d <= 30) return 'text-xs text-warning font-medium';
    return 'text-xs text-success font-medium';
  }

  formatMethod(method: string): string {
    return ({ Stripe: 'Stripe', AdminManual: 'Admin', Cash: 'Cash' }[method] ?? method);
  }

  statusBadge(status: string): string {
    return ({
      Active:    'badge-active',
      Pending:   'badge-pending',
      Expired:   'badge-expired',
      Cancelled: 'badge-cancelled',
    }[status] ?? 'badge') as string;
  }
}