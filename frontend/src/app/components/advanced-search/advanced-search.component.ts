import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatFormFieldControl,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advanced-search',
  imports: [
    MatIcon,
    MatFormFieldModule,
    MatLabel,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
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
    type: ['All', 'Movie', 'Series'],
    genre: ['All', 'Action', 'Drama', 'Comedy'],
    rating: ['All', '9/10', '8/10', '6/10'],
    year: ['All', '2024', '2023', '2022'],
    language: ['All', 'English', 'Spanish', 'French'],
  };

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.emitSearchEvent();
      });
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
}
