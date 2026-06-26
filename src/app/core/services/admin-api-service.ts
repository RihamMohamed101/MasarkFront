import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminUserDto {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminUsersPagedResult {
  items: AdminUserDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/admin`;

  /** GET /api/admin/users?pageNumber=&pageSize=&role= */
  getUsers(
    pageNumber = 1,
    pageSize = 100,
    role?: string,
  ): Observable<AdminUsersPagedResult | AdminUserDto[]> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (role) params = params.set('role', role);
    return this.http.get<AdminUsersPagedResult | AdminUserDto[]>(`${this.base}/users`, { params });
  }
}
