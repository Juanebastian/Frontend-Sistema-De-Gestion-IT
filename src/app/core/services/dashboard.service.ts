import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatsCard, RecentTicket, UserActivity, EquipmentStatus } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = '/api/dashboard';

  constructor(private http: HttpClient) { }

  getAdminDashboard(): Observable<{
    statsCards: StatsCard[];
    recentTickets: RecentTicket[];
    equipmentStatus: EquipmentStatus;
    userActivity: UserActivity[];
  }> {
    return this.http.get<{
      statsCards: StatsCard[];
      recentTickets: RecentTicket[];
      equipmentStatus: EquipmentStatus;
      userActivity: UserActivity[];
    }>(`${this.apiUrl}/admin`);
  }
}