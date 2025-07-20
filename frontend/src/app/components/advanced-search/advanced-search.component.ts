import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advanced-search',
  imports: [
    MatIcon,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatMenuModule,
    MatMenuTrigger,
    CommonModule,
  ],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss',
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
  };

  filters = {
    type: ['All', 'Movie', 'Tv_Show'],
    genre: [
      'All',
      'Action',
      'Comedy',
      'Drama',
      'Thriller',
      'Horror',
      'Science_Fiction',
      'Fantasy',
      'Romance',
      'Animation',
      'Documentary',
    ],
    rating: ['All', '9', '8', '7', '6', '5'],
    year: ['All', '2024', '2023', '2022', '2021', '2020'],
    language: [
      'All',
      'English',
      'French',
      'Spanish',
      'German',
      'Hindi',
      'Mandrin',
      'Japanese',
      'Korean',
      'Arabic',
      'Portuguese',
      'Russian',
      'Italian',
      'Turkish',
      'Swahili',
    ],
  };

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.emitSearchEvent();
      });
  }

  hasActiveFilters(): boolean {
    return (
      this.searchControl.value !== '' ||
      this.selectedFilters.type !== 'All' ||
      this.selectedFilters.genre !== 'All' ||
      this.selectedFilters.rating !== 'All' ||
      this.selectedFilters.year !== 'All' ||
      this.selectedFilters.language !== 'All'
    );
  }

  onFilterChange(name: string, value: string) {
    this.selectedFilters[name as keyof typeof this.selectedFilters] = value;
    this.emitSearchEvent();
  }

  emitSearchEvent() {
    this.search.emit({
      query: this.searchControl.value || '',
      filters: { ...this.selectedFilters },
    });
  }

  resetFilters() {
    this.searchControl.setValue('');
    this.selectedFilters = {
      type: 'All',
      genre: 'All',
      rating: 'All',
      year: 'All',
      language: 'All',
    };
    this.emitSearchEvent();
  }
}
