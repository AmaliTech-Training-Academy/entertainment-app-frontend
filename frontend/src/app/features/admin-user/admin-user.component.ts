import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
})
export class AdminUserComponent {
  users = [
    { name: 'Ethan Carter', role: 'Admin', status: 'Active', joined: '2022-01-15', lastActive: '2024-03-20' },
    { name: 'Olivia Bennett', role: 'Admin', status: 'Active', joined: '2022-03-22', lastActive: '2024-03-19' },
    { name: 'Noah Thompson', role: 'Registered user', status: 'Inactive', joined: '2022-05-10', lastActive: '2023-12-15' },
    { name: 'Ava Harper', role: 'Admin', status: 'Active', joined: '2022-07-05', lastActive: '2024-03-18' },
    { name: 'Liam Foster', role: 'Registered user', status: 'Active', joined: '2022-09-12', lastActive: '2024-03-21' },
    { name: 'Isabella Hayes', role: 'Admin', status: 'Active', joined: '2022-11-01', lastActive: '2024-03-20' },
    { name: 'Jackson Reed', role: 'Registered user', status: 'Inactive', joined: '2023-01-20', lastActive: '2023-11-30' },
    { name: 'Sophia Morgan', role: 'Admin', status: 'Active', joined: '2023-03-15', lastActive: '2024-03-19' },
    { name: 'Aiden Parker', role: 'registered user', status: 'Active', joined: '2023-05-08', lastActive: '2024-03-22' },
    { name: 'Chloe Bennett', role: 'Admin', status: 'Active', joined: '2023-07-02', lastActive: '2024-03-21' },
  ];

  roles = ['Admin', 'Registered user'];
  dropdownOpen = false;
  selectedUserIndex: number | null = null;
  showBanModal = false;
  selectedUserId: string | null = null;
  searchQuery: string = '';


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectRole(role: string) {
    console.log('Selected role:', role);
    this.dropdownOpen = false;
  }

  selectUser(index: number) {
    this.selectedUserIndex = this.selectedUserIndex === index ? null : index;
  }

  toggleUserStatus() {
  if (this.selectedUserIndex !== null) {
    const user = this.users[this.selectedUserIndex];
    this.selectedUserId = user.name;

    // Show confirmation based on current status
    this.showBanModal = true;
  }
}


  get filteredUsers() {
  if (!this.searchQuery.trim()) {
    return this.users;
  }

  const lowerQuery = this.searchQuery.toLowerCase();
  return this.users.filter((user) =>
    user.name.toLowerCase().includes(lowerQuery)
  );
}


  confirmBan() {
  if (this.selectedUserIndex !== null) {
    const user = this.users[this.selectedUserIndex];
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    console.log(`${user.name} is now ${user.status}`);
  }

  this.selectedUserIndex = null;
  this.showBanModal = false;
}


  cancelBan() {
    this.selectedUserId = null;
    this.showBanModal = false;
  }

  changeUserRole(index: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value;
    this.users[index].role = newRole;
    console.log(`User ${this.users[index].name}'s role changed to ${newRole}`);
  }
}
