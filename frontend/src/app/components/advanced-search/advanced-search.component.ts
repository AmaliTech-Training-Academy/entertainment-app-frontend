import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';

@Component({
  selector: 'app-advanced-search',
  imports: [MatIcon, MatFormFieldModule, MatLabel, ReactiveFormsModule],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss',
})
export class AdvancedSearchComponent {
  @Output() searchTermChanged = new EventEmitter<string>();

  searchControl = new FormControl('', { nonNullable: true });

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
