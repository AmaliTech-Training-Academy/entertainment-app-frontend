import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [
    MatIcon,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatMenuTrigger,
    CommonModule,
  ],
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent {
  @Output() search = new EventEmitter<{ query: string; filters: any }>();

  searchControl = new FormControl('');
  selectedFilters = {
    type: 'All',
    genre: 'All',
    rating: 'All',
    year: 'All',
    language: 'All',
    sort_by: 'Title',
    sort_direction: 'desc',
  };

  filters = {
    type: ['All', 'Movie', 'Series'],
    genre: ['All', 'Action', 'Comedy', 'Drama', 'Thriller'],
    rating: [
      'All',
      '1',
      '1.5',
      '2',
      '2.5',
      '3',
      '3.5',
      '4',
      '4.5',
      '5',
      '6',
      '6.5',
      '7',
      '7.5',
      '8',
      '8.5',
      '9',
      '9.5',
      '10',
    ],
    year: ['All', '2025', '2024', '2023', '2022', '2021', '2020', '2019'],
    language: ['All', 'English', 'Spanish', 'French', 'German', 'Hindi', 'Mandarin'],
    sort_by: ['All', 'Title', 'Year', 'Type', 'Duration'],
    sort_direction: ['asc', 'desc'],
  };

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.emitSearchEvent());
  }

  hasActiveFilters(): boolean {
    return Object.entries(this.selectedFilters).some(
      ([key, value]) =>
        (key !== 'page' && key !== 'itemsPerPage' && value !== this.getDefaultValue(key)) ||
        this.searchControl.value !== '',
    );
  }

  private getDefaultValue(key: string): any {
    const defaults: any = {
      type: 'All',
      genre: 'All',
      rating: 'All',
      year: 'All',
      language: 'All',
      sort_by: 'All',
      sort_direction: 'asc',
      page: 1,
      itemsPerPage: 10,
    };
    return defaults[key];
  }

  onFilterSelected(name: string, value: string): void {
    if (this.selectedFilters[name as keyof typeof this.selectedFilters] === value) {
      return;
    }

    // Update the filter
    (this.selectedFilters as any)[name] =
      name === 'page' || name === 'itemsPerPage' ? parseInt(value, 10) : value;

    this.emitSearchEvent();
  }

  emitSearchEvent(): void {
    this.search.emit({
      query: this.searchControl.value || '',
      filters: { ...this.selectedFilters },
    });
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.selectedFilters = {
      type: 'All',
      genre: 'All',
      rating: 'All',
      year: 'All',
      language: 'All',
      sort_by: 'All',
      sort_direction: 'asc',
    };
    this.emitSearchEvent();
  }

  trackByOption(index: number, option: string): string {
    return option;
  }
}
