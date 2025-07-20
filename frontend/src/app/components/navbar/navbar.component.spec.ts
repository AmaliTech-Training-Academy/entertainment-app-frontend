import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, ButtonComponent, AvatarComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Authentication', () => {
    it('should initialize with user not authenticated', () => {
      expect(component.isAuthenticated).toBeFalse();
      expect(component.user).toBeNull();
    });

    it('should check authentication from cookies', () => {
      // Mock cookies
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value:
          'auth_token=test-token; auth_user=' +
          encodeURIComponent(
            JSON.stringify({
              email: 'test@example.com',
              name: 'Test User',
              avatar: 'test-avatar.jpg',
            }),
          ),
      });

      component.checkAuth();

      expect(component.isAuthenticated).toBeTrue();
      expect(component.user).toEqual({
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'test-avatar.jpg',
      });
    });

        it('should handle logout correctly', () => {
      // Set up initial authenticated state
      component.isAuthenticated = true;
      component.user = { email: 'test@example.com', name: 'Test User', avatar: 'test.jpg' };
      
      spyOn(router, 'navigate');

      component.logout();

      expect(component.isAuthenticated).toBeFalse();
      expect(component.user).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Search Functionality', () => {
    it('should initialize with empty search query', () => {
      expect(component.searchQuery).toBe('');
      expect(component.showDropdown).toBeFalse();
    });

    it('should show dropdown on search focus', () => {
      component.onSearchFocus();
      expect(component.showDropdown).toBeTrue();
    });

    it('should hide dropdown on search blur after delay', (done) => {
      component.showDropdown = true;

      component.onSearchBlur();

      setTimeout(() => {
        expect(component.showDropdown).toBeFalse();
        done();
      }, 160);
    });

    it('should update search query and show dropdown on input', () => {
      const mockEvent = { target: { value: 'test search' } } as any;

      component.onSearchInput(mockEvent);

      expect(component.searchQuery).toBe('test search');
      expect(component.showDropdown).toBeTrue();
    });

    it('should hide dropdown when search query is empty', () => {
      const mockEvent = { target: { value: '' } } as any;

      component.onSearchInput(mockEvent);

      expect(component.searchQuery).toBe('');
      expect(component.showDropdown).toBeFalse();
    });
  });

  describe('User Dropdown', () => {
    it('should toggle user dropdown', () => {
      expect(component.showUserDropdown).toBeFalse();

      component.toggleUserDropdown();
      expect(component.showUserDropdown).toBeTrue();

      component.toggleUserDropdown();
      expect(component.showUserDropdown).toBeFalse();
    });

    it('should close dropdowns when clicking outside', () => {
      component.showDropdown = true;
      component.showUserDropdown = true;

      const mockEvent = new Event('click');
      component.handleClickOutside(mockEvent);

      expect(component.showDropdown).toBeFalse();
      expect(component.showUserDropdown).toBeFalse();
    });
  });

  describe('Admin Functionality', () => {
    it('should return false for admin check when user has no roles', () => {
      component.user = { email: 'test@example.com', name: 'Test User', avatar: 'test.jpg' };
      expect(component.isAdmin()).toBeFalse();
    });

    it('should return false for admin check when user is not admin', () => {
      component.user = {
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'test.jpg',
        roles: ['ROLE_USER'],
      };
      expect(component.isAdmin()).toBeFalse();
    });

    it('should return true for admin check when user is admin', () => {
      component.user = {
        email: 'admin@example.com',
        name: 'Admin User',
        avatar: 'admin.jpg',
        roles: ['ROLE_ADMINISTRATOR'],
      };
      expect(component.isAdmin()).toBeTrue();
    });
  });

  describe('Navigation', () => {
    it('should navigate to admin dashboard for admin users', () => {
      component.user = {
        email: 'admin@example.com',
        name: 'Admin User',
        avatar: 'admin.jpg',
        roles: ['ROLE_ADMINISTRATOR'],
      };

      spyOn(router, 'navigate');

      component.goToDashboard();

      expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
    });

    it('should navigate to user dashboard for regular users', () => {
      component.user = {
        email: 'user@example.com',
        name: 'Regular User',
        avatar: 'user.jpg',
        roles: ['ROLE_USER'],
      };

      spyOn(router, 'navigate');

      component.goToDashboard();

      expect(router.navigate).toHaveBeenCalledWith(['/user/dashboard']);
    });

    it('should navigate to user dashboard for users without roles', () => {
      component.user = {
        email: 'user@example.com',
        name: 'Regular User',
        avatar: 'user.jpg',
      };

      spyOn(router, 'navigate');

      component.goToDashboard();

      expect(router.navigate).toHaveBeenCalledWith(['/user/dashboard']);
    });

    it('should navigate to user test page', () => {
      spyOn(router, 'navigate');

      component.goToUserDashboard();

      expect(router.navigate).toHaveBeenCalledWith(['/user-test']);
    });
  });

  describe('Component Properties', () => {
    it('should have search results initialized', () => {
      expect(component.searchResults).toBeDefined();
      expect(component.searchResults.length).toBeGreaterThan(0);
      expect(component.searchResults[0].rank).toBeDefined();
      expect(component.searchResults[0].image).toBeDefined();
      expect(component.searchResults[0].alt).toBeDefined();
      expect(component.searchResults[0].year).toBeDefined();
    });

    it('should have cookies property initialized', () => {
      expect(component.cookies).toBeDefined();
      expect(typeof component.cookies).toBe('object');
    });
  });
});
