import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Import this

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Add FormsModule here
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss']
})
export class AdminContentComponent {
  content = [
    { title: 'Golden Eye', genre: 'Action', duration: '2h', releaseDate: '2023-01-01', status: 'Published', selected: false },
    { title: 'Extraction', genre: 'Drama', duration: '1h 45m', releaseDate: '2022-11-10', status: 'Draft', selected: false },
    { title: 'The Conjuring', genre: 'Comedy', duration: '2h 10m', releaseDate: '2023-05-15', status: 'Published', selected: false },
    { title: 'The Nun', genre: 'Horror', duration: '1h 30m', releaseDate: '2021-10-31', status: 'Archived', selected: false }
  ];

  genres = ['Action', 'Drama', 'Comedy', 'Horror'];
  selectedGenre: string | null = null;
  dropdownOpen = false;

  searchTerm: string = '';
  filteredContent: any[] = [];

  selectAll = false;

  ngOnInit() {
    this.filteredContent = [...this.content];
  }

  filterContent() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredContent = this.content.filter(item =>
      item.title.toLowerCase().includes(term) &&
      (!this.selectedGenre || item.genre === this.selectedGenre)
    );
    this.syncSelection();
  }

  get hasSelection(): boolean {
    return this.filteredContent.some(item => item.selected);
  }

  selectGenre(genre: string) {
    this.selectedGenre = genre;
    this.dropdownOpen = false;
    this.filterContent();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleAll() {
    this.filteredContent.forEach(item => (item.selected = this.selectAll));
  }

  updateSelection() {
    this.selectAll = this.filteredContent.every(item => item.selected);
  }

  syncSelection() {
    this.selectAll = this.filteredContent.every(item => item.selected);
  }

  editSelected() {
    const selectedItems = this.filteredContent.filter(item => item.selected);
    console.log('Edit:', selectedItems);
    // Add logic to open an edit form/modal
  }

  deleteSelected() {
    const confirmed = confirm('Are you sure you want to delete the selected content?');
    if (confirmed) {
      this.content = this.content.filter(item => !item.selected);
      this.filterContent(); // Refresh view
    }
  }

  uploadContent() {
    console.log('Uploading content...');
    // Add logic to handle file upload or open an upload modal
  }
}
