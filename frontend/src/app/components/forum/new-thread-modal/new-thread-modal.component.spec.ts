import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewThreadModalComponent } from './new-thread-modal.component';
import { FormsModule } from '@angular/forms';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with modal closed', () => {
    expect(component.isOpen).toBeFalse();
    expect(component.threadTitle).toBe('');
    expect(component.threadContent).toBe('');
  });

  it('should open the modal', () => {
    component.open();
    expect(component.isOpen).toBeTrue();
  });

  it('should close the modal and reset form', () => {
    // Set some values first
    component.isOpen = true;
    component.threadTitle = 'Test Title';
    component.threadContent = 'Test Content';

    // Spy on the closeModal event emitter
    spyOn(component.closeModal, 'emit');

    component.close();

    expect(component.isOpen).toBeFalse();
    expect(component.threadTitle).toBe('');
    expect(component.threadContent).toBe('');
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should not submit thread with empty title and content', () => {
    spyOn(component.createThread, 'emit');

    component.submitThread();

    expect(component.createThread.emit).not.toHaveBeenCalled();
  });

  it('should submit thread with valid title and content', () => {
    spyOn(component.createThread, 'emit');

    component.threadTitle = 'Test Title';
    component.threadContent = 'Test Content';
    component.submitThread();

    expect(component.createThread.emit).toHaveBeenCalledWith({
      title: 'Test Title',
      content: 'Test Content'
    });
  });

  it('should close modal after successful thread submission', () => {
    spyOn(component, 'close');

    component.threadTitle = 'Test Title';
    component.threadContent = 'Test Content';
    component.submitThread();

    expect(component.close).toHaveBeenCalled();
  });

  it('should close modal when clicking the overlay', () => {
    component.isOpen = true;
    fixture.detectChanges();

    const modalOverlay = fixture.nativeElement.querySelector('.modal-overlay');
    const clickEvent = new MouseEvent('click', { bubbles: true });

    spyOn(component, 'close');
    modalOverlay.dispatchEvent(clickEvent);

    expect(component.close).toHaveBeenCalled();
  });
});
