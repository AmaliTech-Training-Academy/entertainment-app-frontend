import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-user',
  imports: [CommonModule],
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
})
export class AdminUserComponent {
  users = [
    { name: 'Ethan Carter', role: 'Admin', status: 'Active', joined: '2022-01-15', lastActive: '2024-03-20' },
    { name: 'Olivia Bennett', role: 'Editor', status: 'Active', joined: '2022-03-22', lastActive: '2024-03-19' },
    { name: 'Noah Thompson', role: 'Viewer', status: 'Inactive', joined: '2022-05-10', lastActive: '2023-12-15' },
    { name: 'Ava Harper', role: 'Editor', status: 'Active', joined: '2022-07-05', lastActive: '2024-03-18' },
    { name: 'Liam Foster', role: 'Viewer', status: 'Active', joined: '2022-09-12', lastActive: '2024-03-21' },
    { name: 'Isabella Hayes', role: 'Admin', status: 'Active', joined: '2022-11-01', lastActive: '2024-03-20' },
    { name: 'Jackson Reed', role: 'Viewer', status: 'Inactive', joined: '2023-01-20', lastActive: '2023-11-30' },
    { name: 'Sophia Morgan', role: 'Editor', status: 'Active', joined: '2023-03-15', lastActive: '2024-03-19' },
    { name: 'Aiden Parker', role: 'Viewer', status: 'Active', joined: '2023-05-08', lastActive: '2024-03-22' },
    { name: 'Chloe Bennett', role: 'Admin', status: 'Active', joined: '2023-07-02', lastActive: '2024-03-21' },
  ];
}
