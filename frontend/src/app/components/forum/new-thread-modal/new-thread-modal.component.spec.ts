import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewThreadModalComponent } from './new-thread-modal.component';
import { FormsModule } from '@angular/forms';
import { ThreadDto } from '../../../services/bbs.service';

describe('NewThreadModalComponent', () => {
  let component: NewThreadModalComponent;
  let fixture: ComponentFixture<NewThreadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      // declarations: [NewThreadModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NewThreadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializarse con el modal cerrado', () => {
    expect(component.isOpen).toBeFalse();
    expect(component.threadTitle).toBe('');
    expect(component.threadContent).toBe('');
  });

  it('debería abrir el modal', () => {
    component.open();
    expect(component.isOpen).toBeTrue();
  });

  it('debería cerrar el modal y reiniciar el formulario', () => {
    component.isOpen = true;
    component.threadTitle = 'Test Title';
    component.threadContent = 'Test Content';

    spyOn(component.closeModal, 'emit');

    component.close();

    expect(component.isOpen).toBeFalse();
    expect(component.threadTitle).toBe('');
    expect(component.threadContent).toBe('');
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('no debería enviar un hilo con título y contenido vacíos', () => {
    spyOn(component.createThread, 'emit');

    component.submitThread();

    expect(component.createThread.emit).not.toHaveBeenCalled();
  });

  // it('debería enviar un hilo con título y contenido válidos', () => {
  //   spyOn(component.createThread, 'emit');

  //   component.threadTitle = 'Test Title';
  //   component.threadContent = 'Test Content';
  //   component.submitThread();

  //   expect(component.createThread.emit).toHaveBeenCalledWith({
  //     title: 'Test Title',
  //     posts: [{
  //       id: 0,
  //       content: 'Test Content',
  //       createdAt: jasmine.any(String),
  //       lastUpdatedAt: jasmine.any(String),
  //       userId: 1,
  //       threadId: 0,
  //       threadTitle: 'Test Title'
  //     }]
  //   } as ThreadDto);
  // });

  it('debería cerrar el modal después del envío exitoso del hilo', () => {
    spyOn(component, 'close');

    component.threadTitle = 'Test Title';
    component.threadContent = 'Test Content';
    component.submitThread();

    expect(component.close).toHaveBeenCalled();
  });

  it('debería cerrar el modal al hacer clic en el overlay', () => {
    component.isOpen = true;
    fixture.detectChanges();

    const modalOverlay = fixture.nativeElement.querySelector('.modal-overlay');
    const clickEvent = new MouseEvent('click', { bubbles: true });

    spyOn(component, 'close');
    modalOverlay.dispatchEvent(clickEvent);

    expect(component.close).toHaveBeenCalled();
  });
});
