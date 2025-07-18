import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.scss'],
})
export class AdminContentComponent {
  content = [
    {
      title: 'Golden Eye',
      genre: 'Action',
      duration: '2h',
      releaseDate: '2023-01-01',
      status: 'Published',
      selected: false,
    },
    {
      title: 'Extraction',
      genre: 'Drama',
      duration: '1h 45m',
      releaseDate: '2022-11-10',
      status: 'Draft',
      selected: false,
    },
    {
      title: 'The Conjuring',
      genre: 'Comedy',
      duration: '2h 10m',
      releaseDate: '2023-05-15',
      status: 'Published',
      selected: false,
    },
    {
      title: 'The Nun',
      genre: 'Horror',
      duration: '1h 30m',
      releaseDate: '2021-10-31',
      status: 'Archived',
      selected: false,
    },
  ];

  genres = ['Action', 'Drama', 'Comedy', 'Horror'];
  selectedGenre: string | null = null;
  dropdownOpen = false;

  searchTerm: string = '';
  filteredContent: any[] = [];

  selectAll = false;
  showUploadForm = false;
  showEditForm = false;
  showConfirmModal = false;
  editingMultiple = false;

  newContent = {
    title: '',
    genre: '',
    duration: '',
    releaseDate: '',
    status: 'Draft',
  };

  editContent = {
    title: '',
    genre: '',
    duration: '',
    releaseDate: '',
    status: '',
  };

  ngOnInit() {
    this.filteredContent = [...this.content];
  }

  filterContent() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredContent = this.content.filter(
      (item) =>
        item.title.toLowerCase().includes(term) &&
        (!this.selectedGenre || item.genre === this.selectedGenre),
    );
    this.syncSelection();
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
    this.filteredContent.forEach((item) => (item.selected = this.selectAll));
  }

  updateSelection() {
    this.selectAll = this.filteredContent.every((item) => item.selected);
  }

  syncSelection() {
    this.selectAll = this.filteredContent.every((item) => item.selected);
  }

  uploadContent() {
    this.showUploadForm = !this.showUploadForm;
  }

  addContent() {
    const { title, genre, duration, releaseDate, status } = this.newContent;
    if (!title || !genre || !duration || !releaseDate || !status) {
      alert('Please fill out all fields.');
      return;
    }

    this.content.unshift({ ...this.newContent, selected: false });
    this.filterContent();
    this.showUploadForm = false;

    this.newContent = {
      title: '',
      genre: '',
      duration: '',
      releaseDate: '',
      status: 'Draft',
    };
  }

  editSelected() {
    const selectedItems = this.filteredContent.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      alert('Please select at least one item to edit.');
      return;
    }

    this.editingMultiple = selectedItems.length > 1;
    this.editContent = { ...selectedItems[0] };
    this.showEditForm = true;
  }

  submitEdit() {
    const selectedItems = this.filteredContent.filter((item) => item.selected);
    selectedItems.forEach((item) => {
      item.title = this.editContent.title;
      item.genre = this.editContent.genre;
      item.duration = this.editContent.duration;
      item.releaseDate = this.editContent.releaseDate;
      item.status = this.editContent.status;
    });

    this.showEditForm = false;
  }

  deleteSelected() {
    this.showConfirmModal = true;
  }

  confirmDelete() {
    this.content = this.content.filter((item) => !item.selected);
    this.filterContent();
    this.showConfirmModal = false;
  }

  cancelDelete() {
    this.showConfirmModal = false;
  }

  onItemSelectionChange() {
    this.syncSelection();
  }
}
