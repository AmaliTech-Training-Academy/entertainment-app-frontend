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
  @Output() searchTermChanged = new EventEmitter<string>();

  searchControl = new FormControl('', { nonNullable: true });
  filters = {
    type: ['All', 'Movie', 'Series'],
    genre: ['All', 'Action', 'Drama', 'Comedy'],
    rating: ['All', 'G', 'PG', 'PG-13', 'R'],
    year: ['All', '2024', '2023', '2022'],
    language: ['All', 'English', 'Spanish', 'French'],
  };
  constructor() {
    this.setupSearchDebounce();
  }

  private setupSearchDebounce(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((term) => term.length >= 2 || term.length === 0),
        tap((term) => this.searchTermChanged.emit(term))
      )
      .subscribe();
  }

  onSubmit(): void {
    if (this.searchControl.value.trim()) {
      this.searchTermChanged.emit(this.searchControl.value.trim());
    }
  }

  /**
   * Clears the search input
   */
  clearSearch(): void {
    this.searchControl.reset();
    this.searchTermChanged.emit('');
  }
}
