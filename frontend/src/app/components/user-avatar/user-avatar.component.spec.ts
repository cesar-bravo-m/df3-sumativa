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

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  describe('Inicialización', () => {
    it('debería inicializarse con el menú desplegable cerrado', () => {
      expect(component.isDropdownOpen).toBeFalse();
    });

    it('debería cargar el usuario desde localStorage si está disponible', () => {
      localStorageSpy.getItem.and.returnValue(JSON.stringify(mockUser));
      component.ngOnInit();
      expect(component.currentUser).toEqual(mockUser);
    });

    it('debería manejar la ausencia de usuario en localStorage', () => {
      localStorageSpy.getItem.and.returnValue(null);
      component.ngOnInit();
      expect(component.currentUser).toBeNull();
    });

  });

  describe('Funcionalidad del menú desplegable', () => {
    it('debería alternar el estado del menú desplegable', () => {
      expect(component.isDropdownOpen).toBeFalse();
      component.toggleDropdown();
      expect(component.isDropdownOpen).toBeTrue();
      component.toggleDropdown();
      expect(component.isDropdownOpen).toBeFalse();
    });

    it('debería cerrar el menú desplegable', () => {
      component.isDropdownOpen = true;
      component.closeDropdown();
      expect(component.isDropdownOpen).toBeFalse();
    });
  });

  describe('Navegación', () => {
    it('debería navegar al perfil y cerrar el menú desplegable', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.isDropdownOpen = true;

      component.goToProfile();

      expect(navigateSpy).toHaveBeenCalledWith(['/profile']);
      expect(component.isDropdownOpen).toBeFalse();
    });

    it('debería cerrar sesión, limpiar localStorage y navegar al inicio de sesión', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.isDropdownOpen = true;
      component.currentUser = mockUser;

      component.logout();

      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('currentUser');
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
      expect(component.isDropdownOpen).toBeFalse();
    });
  });

  describe('Manejo de clics', () => {
    it('debería cerrar el menú desplegable al hacer clic fuera', () => {
      const mockEvent = {
        target: document.createElement('div'),
        type: 'click'
      } as unknown as MouseEvent;

      component.isDropdownOpen = true;
      component.onDocumentClick(mockEvent);

      expect(component.isDropdownOpen).toBeFalse();
    });

    it('no debería cerrar el menú desplegable al hacer clic dentro', () => {
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

    it('debería manejar el clic en un elemento hijo del contenedor del avatar', () => {
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
