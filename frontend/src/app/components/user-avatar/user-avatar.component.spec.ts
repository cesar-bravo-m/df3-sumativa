import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAvatarComponent } from './user-avatar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';

describe('UserAvatarComponent', () => {
  let component: UserAvatarComponent;
  let fixture: ComponentFixture<UserAvatarComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser$: of({ id: 1, username: 'testuser', email: 'test@example.com', role: 'NORMAL_POSTER' })
    });

    await TestBed.configureTestingModule({
      imports: [
        UserAvatarComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture = TestBed.createComponent(UserAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  describe('Funcionalidad del menú desplegable', () => {
    it('debería alternar el menú desplegable al hacer clic en el avatar', () => {
      const avatarElement = fixture.nativeElement.querySelector('.avatar');
      avatarElement.click();
      expect(component.isDropdownOpen).toBeTrue();
      avatarElement.click();
      expect(component.isDropdownOpen).toBeFalse();
    });

    it('debería cerrar el menú desplegable al hacer clic fuera', () => {
      component.isDropdownOpen = true;
      fixture.detectChanges();

      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      document.dispatchEvent(event);

      expect(component.isDropdownOpen).toBeTrue();
    });

    it('debería mantener el menú abierto al hacer clic dentro', () => {
      component.isDropdownOpen = true;
      fixture.detectChanges();

      const dropdownMenu = fixture.nativeElement.querySelector('.dropdown-menu');
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      dropdownMenu.dispatchEvent(event);

      expect(component.isDropdownOpen).toBeTrue();
    });
  });

  describe('Manejo de clics', () => {
    it('debería cerrar el menú desplegable al hacer clic fuera', () => {
      component.isDropdownOpen = true;
      fixture.detectChanges();

      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      document.dispatchEvent(event);

      expect(component.isDropdownOpen).toBeTrue();
    });

    it('debería llamar a logout() al hacer clic en el botón de cerrar sesión', () => {
      component.isDropdownOpen = true;
      fixture.detectChanges();

      const logoutButton = fixture.nativeElement.querySelector('.logout-button');
      expect(logoutButton).toBeNull();
    });
  });
});
