import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../../core/services/admin/admin.service';
import { AdminUser, UserRoleUpdateResponse } from '../../models/admin-users';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, ConfirmModalComponent],
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
})
export class AdminUserComponent implements OnInit {
  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  selectedRole: string = 'ALL';
  searchTerm: string = '';
  selectedUsers: number[] = [];
  newRole: string = '';
  roles: string[] = ['ROLE_ADMINISTRATOR', 'ROLE_AUTHENTICATED_USER', 'ROLE_PUBLIC_USER'];

  // Modal properties
  showConfirmModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  modalConfirmText: string = 'Confirm';
  modalCancelText: string = 'Cancel';
  pendingAction: 'delete' | 'ban' | 'unban' | null = null;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe((res) => {
      this.users = res.data.content;
      this.applyFilters();
      // Clear selections when reloading users
      this.selectedUsers = [];
    });
  }

  applyFilters(): void {
    let filtered = [...this.users];

    // Apply role filter
    if (this.selectedRole !== 'ALL') {
      filtered = filtered.filter((user) => user.roles.includes(this.selectedRole));
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const username = user.username.toLowerCase();
        const email = user.email.toLowerCase();

        return (
          fullName.includes(searchLower) ||
          username.includes(searchLower) ||
          email.includes(searchLower)
        );
      });
    }

    this.filteredUsers = filtered;

    // Remove selected users that are no longer visible after filtering
    this.selectedUsers = this.selectedUsers.filter((userId) =>
      this.filteredUsers.some((user) => user.id === userId),
    );
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = 'ALL';
    this.applyFilters();
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
      // Select all users in current filtered view (including banned ones)
      this.selectedUsers = this.filteredUsers.map((user) => user.id);
    } else {
      this.selectedUsers = [];
    }
  }

  isAllSelected(): boolean {
    return (
      this.filteredUsers.length > 0 &&
      this.filteredUsers.every((user) => this.selectedUsers.includes(user.id))
    );
  }

  isIndeterminate(): boolean {
    const selectedCount = this.filteredUsers.filter((user) =>
      this.selectedUsers.includes(user.id),
    ).length;
    return selectedCount > 0 && selectedCount < this.filteredUsers.length;
  }

  shouldShowBanAction(): boolean {
    if (this.selectedUsers.length === 0) {
      return true; // Default to "Deactivate" when nothing is selected
    }

    // Check if all selected users are currently banned (inactive)
    const selectedUserObjects = this.users.filter((user) => this.selectedUsers.includes(user.id));
    const allSelectedAreInactive = selectedUserObjects.every((user) =>
      user.roles.includes('ROLE_BANNED'),
    );

    // If all selected users are inactive, show "Activate", otherwise show "Deactivate"
    return !allSelectedAreInactive;
  }

  areAllSelectedUsersBanned(): boolean {
    if (this.selectedUsers.length === 0) {
      return false;
    }

    const selectedUserObjects = this.users.filter((user) => this.selectedUsers.includes(user.id));
    return selectedUserObjects.every((user) => user.roles.includes('ROLE_BANNED'));
  }

  getBanButtonText(): string {
    if (this.selectedUsers.length === 0) {
      return 'Deactivate Selected (0)';
    }

    if (this.areAllSelectedUsersBanned()) {
      return `All Selected Users Already Banned (${this.selectedUsers.length})`;
    }

    const actionType = this.shouldShowBanAction() ? 'Deactivate' : 'Activate';
    return `${actionType} Selected (${this.selectedUsers.length})`;
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
            this.users[index].lastUpdatedAt = new Date().toISOString();
          }
        });

        // Refresh filtered users and clear selections
        this.applyFilters();
        this.selectedUsers = [];

        // Force change detection to update UI
        this.cdr.detectChanges();
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

  // Show confirmation modal for ban/unban action
  confirmToggleSelectedUsersBan(): void {
    if (this.selectedUsers.length === 0) {
      this.snackBar.open('Please select users to activate/deactivate', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['snack-error'],
      });
      return;
    }

    // Check if all selected users are already banned
    if (this.areAllSelectedUsersBanned()) {
      this.snackBar.open('All selected users are already banned', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['snack-error'],
      });
      return;
    }

    const actionType = this.shouldShowBanAction() ? 'deactivate' : 'activate';
    this.pendingAction = this.shouldShowBanAction() ? 'ban' : 'unban';

    this.modalTitle = `${actionType === 'deactivate' ? 'Deactivate' : 'Activate'} Users`;
    this.modalMessage = `Are you sure you want to ${actionType} ${this.selectedUsers.length} user(s)? ${
      actionType === 'deactivate'
        ? 'They will no longer be able to access the system.'
        : 'They will regain access to the system.'
    }`;
    this.modalConfirmText = actionType === 'deactivate' ? 'Deactivate' : 'Activate';
    this.modalCancelText = 'Cancel';

    this.showConfirmModal = true;
  }

  toggleSelectedUsersBan(): void {
    // Show loading state
    const actionType = this.pendingAction === 'ban' ? 'deactivate' : 'activate';
    this.snackBar.open(
      `${actionType === 'deactivate' ? 'Deactivating' : 'Activating'} ${this.selectedUsers.length} user(s)...`,
      'Close',
      {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      },
    );

    // Create array of ban/unban requests
    const banRequests = this.selectedUsers.map((userId) => this.adminService.toggleBanUser(userId));

    // Execute all requests concurrently
    forkJoin(banRequests).subscribe({
      next: (responses: UserRoleUpdateResponse[]) => {
        console.log('Ban/Unban responses:', responses); // Debug log

        // Update local user data
        responses.forEach((response) => {
          const updatedUser = response.data;
          const index = this.users.findIndex((user) => user.id === updatedUser.id);
          if (index !== -1) {
            // Ensure we're updating with the latest roles from the server
            this.users[index] = { ...this.users[index], ...updatedUser };
            console.log(`Updated user ${updatedUser.id} roles:`, updatedUser.roles); // Debug log
          }
        });

        // Refresh filtered users and clear selections
        this.applyFilters();
        this.selectedUsers = [];

        const successMessage =
          actionType === 'deactivate'
            ? `Successfully deactivated ${responses.length} user(s)`
            : `Successfully activated ${responses.length} user(s)`;

        this.snackBar.open(successMessage, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        this.snackBar.open(`Failed to ${actionType} some users. Please try again.`, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snack-error'],
        });
        console.error(`Failed to ${actionType} users:`, err);

        // Reload users to ensure data consistency
        this.loadUsers();
      },
    });
  }

  // Show confirmation modal for delete action
  confirmDeleteSelectedUsers(): void {
    if (this.selectedUsers.length === 0) {
      this.snackBar.open('Please select users to delete', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['snack-error'],
      });
      return;
    }

    this.pendingAction = 'delete';
    this.modalTitle = 'Delete Users';
    this.modalMessage = `Are you sure you want to permanently delete ${this.selectedUsers.length} user(s)? This action cannot be undone and will remove all user data from the system.`;
    this.modalConfirmText = 'Delete';
    this.modalCancelText = 'Cancel';

    this.showConfirmModal = true;
  }

  deleteSelectedUsers(): void {
    // Show loading state
    this.snackBar.open(`Deleting ${this.selectedUsers.length} user(s)...`, 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });

    // Create array of delete requests
    const deleteRequests = this.selectedUsers.map((userId) => this.adminService.deleteUser(userId));

    // Execute all requests concurrently
    forkJoin(deleteRequests).subscribe({
      next: (responses) => {
        // Remove deleted users from local data
        this.users = this.users.filter((user) => !this.selectedUsers.includes(user.id));

        // Refresh filtered users and clear selections
        this.applyFilters();
        this.selectedUsers = [];

        this.snackBar.open(`Successfully deleted ${responses.length} user(s)`, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        console.error('Failed to delete users:', err);

        let errorMessage = 'Failed to delete some users. Please try again.';

        // Handle specific error cases
        if (err.status === 401) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (err.status === 403) {
          errorMessage = 'You do not have permission to delete users.';
        } else if (err.status === 404) {
          errorMessage = 'One or more users not found.';
        }

        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snack-error'],
        });

        // Reload users to ensure data consistency
        this.loadUsers();
      },
    });
  }

  // Modal event handlers
  onConfirmAction(): void {
    this.showConfirmModal = false;

    switch (this.pendingAction) {
      case 'delete':
        this.deleteSelectedUsers();
        break;
      case 'ban':
      case 'unban':
        this.toggleSelectedUsersBan();
        break;
    }

    this.pendingAction = null;
  }

  onCancelAction(): void {
    this.showConfirmModal = false;
    this.pendingAction = null;
  }

  clearSelection(): void {
    this.selectedUsers = [];
    this.newRole = '';
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'ROLE_ADMINISTRATOR':
        return 'admin-role';
      case 'ROLE_AUTHENTICATED_USER':
        return 'authenticated-user-role';
      case 'ROLE_PUBLIC_USER':
        return 'public-user-role';
      case 'ROLE_BANNED':
        return 'banned-role';
      default:
        return 'default-role';
    }
  }

  getUserDisplayRole(user: AdminUser): string {
    // If user is banned, show ROLE_BANNED regardless of other roles
    if (user.roles.includes('ROLE_BANNED')) {
      return 'ROLE_BANNED';
    }
    // Otherwise, show the first non-banned role
    return user.roles.find((role) => role !== 'ROLE_BANNED') || user.roles[0];
  }

  // Helper method to check if user is active (not banned)
  isUserActive(user: AdminUser): boolean {
    return !user.roles.includes('ROLE_BANNED');
  }
}
