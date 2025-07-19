// core/services/dashboard/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TrendingMediaResponse } from '../../../models/trending-media.model.js';
import { AdminMetricsResponse } from '../../../models/admin-metrics.model.js';
import { MediaListing } from '../../../models/media-listing.model.js';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private base_Url =
    'http://cineverse-service-alb-staging-276074081.eu-west-1.elb.amazonaws.com/api/v1';

  constructor(private http: HttpClient) {}

  getMetrics(): Observable<AdminMetricsResponse> {
    return this.http.get<AdminMetricsResponse>(`${this.base_Url}/admin/metrics`);
  }

  getTrendingMedia(): Observable<TrendingMediaResponse> {
    return this.http.get<TrendingMediaResponse>(`${this.base_Url}/media/trending-now`);
  }

  getMediaListings(): Observable<{ data: { content: MediaListing[] } }> {
    return this.http.get<{ data: { content: MediaListing[] } }>(`${this.base_Url}/media/listings`);
  }
}

