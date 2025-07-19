// import { Component, OnInit } from '@angular/core';

// import { AdminService } from '../../core/services/admin/admin.service';
// import { User } from '../../models/user';

// @Component({
//   selector: 'app-user-management',
//   templateUrl: './user-management.component.html',
//   styleUrls: ['./user-management.component.scss'],
// })
// export class UserManagementComponent implements OnInit {
//   users: User[] = [];
//   filteredUsers: User[] = [];
//   selectedRole = 'ALL';

//   constructor(private adminService: AdminService) {}

//   ngOnInit(): void {
//     this.adminService.getAllUsers().subscribe((response) => {
//       this.users = response.data.content;
//       this.filteredUsers = [...this.users];
//     });
//   }

//   filterByRole(role: string): void {
//     this.selectedRole = role;
//     this.filteredUsers =
//       role === 'ALL' ? [...this.users] : this.users.filter((user) => user.roles.includes(role));
//   }
// }
