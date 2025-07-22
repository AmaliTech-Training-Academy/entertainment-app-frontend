// core/services/dashboard/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TrendingMediaResponse } from '../../../models/trending-media.model.js';
import { AdminMetricsResponse } from '../../../models/admin-metrics.model.js';
import { MediaListing } from '../../../models/media-listing.model.js';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getMetrics(): Observable<AdminMetricsResponse> {
    return this.http.get<AdminMetricsResponse>(`${environment.apiUrl}/api/v1/admin/metrics`);
  }

  getTrendingMedia(): Observable<TrendingMediaResponse> {
    return this.http.get<TrendingMediaResponse>(`${environment.apiUrl}/api/v1/media/trending-now`);
  }

  getMediaListings(): Observable<{ data: { content: MediaListing[] } }> {
    return this.http.get<{ data: { content: MediaListing[] } }>(
      `${environment.apiUrl}/api/v1/media/listings`,
    );
  }
}
