import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin/admin.service';
import { AdminUser, UserRoleUpdateResponse } from '../../models/admin-users';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
})
export class AdminUserComponent implements OnInit {
  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  selectedRole: string = 'ALL';
  selectedUsers: number[] = [];
  newRole: string = '';
  roles: string[] = [
    'ROLE_PUBLIC_USER',
    'ROLE_ADMIN',
    'ROLE_ADMINISTRATOR',
  ];

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe((res) => {
      this.users = res.data.content;
      this.filteredUsers = [...this.users];
      // Clear selections when reloading users
      this.selectedUsers = [];
    });
  }

  filterByRole(): void {
    if (this.selectedRole === 'ALL') {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter((user) => user.roles.includes(this.selectedRole));
    }

    // Remove selected users that are no longer visible after filtering
    this.selectedUsers = this.selectedUsers.filter((userId) =>
      this.filteredUsers.some((user) => user.id === userId),
    );
  }

  toggleUserSelection(userId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      if (!this.selectedUsers.includes(userId)) {
        this.selectedUsers.push(userId);
      }
    } else {
      this.selectedUsers = this.selectedUsers.filter((id) => id !== userId);
    }
  }

  toggleSelectAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      // Select all non-banned users in current filtered view
      this.selectedUsers = this.filteredUsers
        .filter((user) => !user.roles.includes('ROLE_BANNED'))
        .map((user) => user.id);
    } else {
      this.selectedUsers = [];
    }
  }

  isAllSelected(): boolean {
    const selectableUsers = this.filteredUsers.filter(
      (user) => !user.roles.includes('ROLE_BANNED'),
    );
    return (
      selectableUsers.length > 0 &&
      selectableUsers.every((user) => this.selectedUsers.includes(user.id))
    );
  }

  isIndeterminate(): boolean {
    const selectableUsers = this.filteredUsers.filter(
      (user) => !user.roles.includes('ROLE_BANNED'),
    );
    const selectedCount = selectableUsers.filter((user) =>
      this.selectedUsers.includes(user.id),
    ).length;
    return selectedCount > 0 && selectedCount < selectableUsers.length;
  }

  changeSelectedUsersRole(): void {
    if (!this.newRole || this.selectedUsers.length === 0) {
      this.snackBar.open('Please select users and a role', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['snack-error'],
      });
      return;
    }

    // Show loading state
    this.snackBar.open(`Updating ${this.selectedUsers.length} user(s)...`, 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });

    // Create array of role change requests
    const roleChangeRequests = this.selectedUsers.map((userId) =>
      this.adminService.changeUserRole(userId, this.newRole),
    );

    // Execute all requests concurrently
    forkJoin(roleChangeRequests).subscribe({
      next: (responses: UserRoleUpdateResponse[]) => {
        // Update local user data
        responses.forEach((response) => {
          const updatedUser = response.data;
          const index = this.users.findIndex((user) => user.id === updatedUser.id);
          if (index !== -1) {
            this.users[index].roles = updatedUser.roles;
          }
        });

        // Refresh filtered users and clear selections
        this.filterByRole();
        this.selectedUsers = [];
        this.newRole = '';

        this.snackBar.open(`Successfully updated ${responses.length} user(s)`, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to update some users. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snack-error'],
        });
        console.error('Failed to change roles:', err);

        // Reload users to ensure data consistency
        this.loadUsers();
      },
    });
  }

  clearSelection(): void {
    this.selectedUsers = [];
    this.newRole = '';
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'admin-role';
      case 'ROLE_PUBLIC_USER':
        return 'user-role';
      case 'ROLE_BANNED':
        return 'banned-role';
      default:
        return 'default-role';
    }
  }

  toggleUserBan(userId: number): void {
    this.adminService.toggleBanUser(userId).subscribe({
      next: (res: UserRoleUpdateResponse) => {
        const updatedUser = res.data;
        const index = this.users.findIndex((user) => user.id === updatedUser.id);

        if (index !== -1) {
          this.users[index].roles = updatedUser.roles;
          this.filterByRole();
        }

        // Remove from selection if user was banned
        if (updatedUser.roles.includes('ROLE_BANNED')) {
          this.selectedUsers = this.selectedUsers.filter((id) => id !== userId);
        }

        const isBanned = updatedUser.roles.includes('ROLE_BANNED');
        this.snackBar.open(`User ${isBanned ? 'banned' : 'unbanned'} successfully`, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to toggle ban status', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snack-error'],
        });
        console.error('Failed to toggle ban:', err);
      },
    });
  }
}
