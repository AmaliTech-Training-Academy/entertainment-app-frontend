import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
})
export class AdminUserComponent {
   users = [
    { name: 'Ethan Carter', role: 'Admin', status: 'Active', joined: '2022-01-15', lastActive: '2024-03-20' },
    { name: 'Olivia Bennett', role: 'Registered user', status: 'Active', joined: '2022-03-22', lastActive: '2024-03-19' },
    { name: 'Noah Thompson', role: 'Public user', status: 'Inactive', joined: '2022-05-10', lastActive: '2023-12-15' },
    { name: 'Ava Harper', role: 'Admin', status: 'Active', joined: '2022-07-05', lastActive: '2024-03-18' },
    { name: 'Liam Foster', role: 'Public user', status: 'Active', joined: '2022-09-12', lastActive: '2024-03-21' },
    { name: 'Isabella Hayes', role: 'Admin', status: 'Active', joined: '2022-11-01', lastActive: '2024-03-20' },
    { name: 'Jackson Reed', role: 'Registered user', status: 'Inactive', joined: '2023-01-20', lastActive: '2023-11-30' },
    { name: 'Sophia Morgan', role: 'Admin', status: 'Active', joined: '2023-03-15', lastActive: '2024-03-19' },
    { name: 'Aiden Parker', role: 'Public user', status: 'Active', joined: '2023-05-08', lastActive: '2024-03-22' },
    { name: 'Chloe Bennett', role: 'Admin', status: 'Active', joined: '2023-07-02', lastActive: '2024-03-21' },
  ];

  roles = ['Admin', 'Registered user', 'Public user'];
  dropdownOpen = false;
  showCreateUserModal = false;

  newUser = {
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    role: ''
  };

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectRole(role: string) {
    console.log('Selected role:', role);
    this.dropdownOpen = false;
  }

  openCreateUserModal() {
    this.showCreateUserModal = true;
  }

  closeCreateUserModal() {
    this.showCreateUserModal = false;
  }

  createUser() {
    this.newUser.name = `${this.newUser.firstName} ${this.newUser.lastName}`;
    this.users.unshift({
      name: this.newUser.name,
      role: this.newUser.role,
      status: 'Active',
      joined: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    });
    this.newUser = {
      firstName: '',
      lastName: '',
      name: '',
      email: '',
      role: ''
    };
    this.showCreateUserModal = false;
  }
}
