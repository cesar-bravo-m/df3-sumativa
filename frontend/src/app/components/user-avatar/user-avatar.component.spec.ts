import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAvatarComponent } from './user-avatar.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

describe('UserAvatarComponent', () => {
  let component: UserAvatarComponent;
  let fixture: ComponentFixture<UserAvatarComponent>;
  let router: Router;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  const mockUser = {
    username: 'testuser',
    email: 'test@example.com'
  };

  beforeEach(async () => {
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'removeItem']);
    Object.defineProperty(window, 'localStorage', { value: localStorageSpy });

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        UserAvatarComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserAvatarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with dropdown closed', () => {
      expect(component.isDropdownOpen).toBeFalse();
    });

    it('should load user from localStorage if available', () => {
      localStorageSpy.getItem.and.returnValue(JSON.stringify(mockUser));
      component.ngOnInit();
      expect(component.currentUser).toEqual(mockUser);
    });

    it('should handle missing user in localStorage', () => {
      localStorageSpy.getItem.and.returnValue(null);
      component.ngOnInit();
      expect(component.currentUser).toBeNull();
    });

  });

  describe('Dropdown Functionality', () => {
    it('should toggle dropdown state', () => {
      expect(component.isDropdownOpen).toBeFalse();
      component.toggleDropdown();
      expect(component.isDropdownOpen).toBeTrue();
      component.toggleDropdown();
      expect(component.isDropdownOpen).toBeFalse();
    });

    it('should close dropdown', () => {
      component.isDropdownOpen = true;
      component.closeDropdown();
      expect(component.isDropdownOpen).toBeFalse();
    });
  });

  describe('Navigation', () => {
    it('should navigate to profile and close dropdown', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.isDropdownOpen = true;

      component.goToProfile();

      expect(navigateSpy).toHaveBeenCalledWith(['/profile']);
      expect(component.isDropdownOpen).toBeFalse();
    });

    it('should logout, clear localStorage, and navigate to login', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.isDropdownOpen = true;
      component.currentUser = mockUser;

      component.logout();

      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('currentUser');
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
      expect(component.isDropdownOpen).toBeFalse();
    });
  });

  describe('Click Handling', () => {
    it('should close dropdown when clicking outside', () => {
      const mockEvent = {
        target: document.createElement('div'),
        type: 'click'
      } as unknown as MouseEvent;

      component.isDropdownOpen = true;
      component.onDocumentClick(mockEvent);

      expect(component.isDropdownOpen).toBeFalse();
    });

    it('should not close dropdown when clicking inside', () => {
      const container = document.createElement('div');
      container.className = 'user-avatar-container';
      const mockEvent = {
        target: container,
        type: 'click'
      } as unknown as MouseEvent;

      component.isDropdownOpen = true;
      component.onDocumentClick(mockEvent);

      expect(component.isDropdownOpen).toBeTrue();
    });

    it('should handle click on avatar container child element', () => {
      const container = document.createElement('div');
      container.className = 'user-avatar-container';
      const child = document.createElement('span');
      container.appendChild(child);
      const mockEvent = {
        target: child,
        type: 'click'
      } as unknown as MouseEvent;

      component.isDropdownOpen = true;
      component.onDocumentClick(mockEvent);

      expect(component.isDropdownOpen).toBeTrue();
    });
  });
});
