import { Injectable } from '@angular/core';
import { MoviesApiResponse } from './advanced-search.service';

@Injectable({
  providedIn: 'root',
})
export class SearchCacheService {
  private cache = new Map<string, { data: MoviesApiResponse; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

  get(key: string): MoviesApiResponse | null {
    const cachedItem = this.cache.get(key);
    if (!cachedItem) return null;

    // Check if cache is expired
    if (Date.now() - cachedItem.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cachedItem.data;
  }

  set(key: string, data: MoviesApiResponse): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}
