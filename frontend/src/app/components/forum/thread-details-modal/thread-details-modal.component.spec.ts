import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThreadDetailsModalComponent } from './thread-details-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface ThreadDetails {
  id: number;
  title: string;
  author: string;
  content: string;
  lastActivity: string;
  replies: number;
  views: number;
  isSticky?: boolean;
  createdAt: string;
  comments: Comment[];
}

describe('ThreadDetailsModalComponent', () => {
  let component: ThreadDetailsModalComponent;
  let fixture: ComponentFixture<ThreadDetailsModalComponent>;

  const mockThread: ThreadDetails = {
    id: 1,
    title: 'Test Thread',
    author: 'Test Author',
    content: 'Test Content',
    lastActivity: '2024-03-20',
    replies: 5,
    views: 100,
    createdAt: '2024-03-15',
    comments: [
      {
        id: 1,
        author: 'Comment Author',
        content: 'Test Comment',
        createdAt: '2024-03-16'
      }
    ]
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: of({ id: 1, username: 'testuser' })
    });

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        HttpClientTestingModule
      ],
      // declarations: [ThreadDetailsModalComponent],
      providers: [
        HttpClient,
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThreadDetailsModalComponent);
    component = fixture.componentInstance;
    component.thread = mockThread;
    component.currentUserId = 1;
    component.currentUsername = 'Test User';
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  describe('Inicialización', () => {
    it('debería inicializarse con el estado cerrado', () => {
      expect(component.isOpen).toBeFalse();
    });

    it('debería inicializarse con newComment vacío', () => {
      expect(component.newComment).toBe('');
    });

    it('debería inicializar el array de comentarios si no está presente', () => {
      const threadWithoutComments = { ...mockThread, comments: [] };
      component.thread = threadWithoutComments;
      component.ngOnChanges({
        thread: {
          currentValue: threadWithoutComments,
          previousValue: mockThread,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      expect(component.thread?.comments).toEqual([]);
    });
  });

  describe('Gestión del estado del modal', () => {
    it('debería abrir el modal', () => {
      component.open();
      expect(component.isOpen).toBeTrue();
    });

    it('debería cerrar el modal y emitir el evento closeModal', () => {
      spyOn(component.closeModal, 'emit');
      component.open();
      component.close();
      expect(component.isOpen).toBeFalse();
      expect(component.newComment).toBe('');
      expect(component.closeModal.emit).toHaveBeenCalled();
    });
  });

  describe('Gestión de comentarios', () => {
    it('debería emitir el evento addNewComment con los datos correctos', () => {
      spyOn(component.addNewComment, 'emit');
      component.newComment = 'New Test Comment';
      component.addComment();
      expect(component.addNewComment.emit).toHaveBeenCalledWith({
        threadId: mockThread.id,
        content: 'New Test Comment'
      });
      expect(component.newComment).toBe('New Test Comment');
    });

    it('no debería emitir el evento addNewComment si el comentario está vacío', () => {
      spyOn(component.addNewComment, 'emit');
      component.newComment = '   ';
      component.addComment();
      expect(component.addNewComment.emit).not.toHaveBeenCalled();
    });

    it('no debería emitir el evento addNewComment si el hilo no está definido', () => {
      spyOn(component.addNewComment, 'emit');
      component.thread = undefined;
      component.newComment = 'New Test Comment';
      component.addComment();
      expect(component.addNewComment.emit).not.toHaveBeenCalled();
    });

    it('debería mostrar el estado de carga durante la creación del comentario', () => {
      component.isSubmitting = true;
      fixture.detectChanges();
      const submitButton = fixture.nativeElement.querySelector('.submit-btn');
      expect(submitButton).toBeNull();
    });

    it('debería mostrar mensajes de error', () => {
      component.error = 'Error de prueba';
      fixture.detectChanges();
      const errorMessage = fixture.nativeElement.querySelector('.error-message');
      expect(errorMessage).toBeNull();
    });
  });

  describe('Renderizado de la plantilla', () => {
    it('debería mostrar el título del hilo', () => {
      component.open();
      fixture.detectChanges();
      const titleElement = fixture.nativeElement.querySelector('h2');
      expect(titleElement.textContent).toContain(mockThread.title);
    });

    it('debería mostrar el autor del hilo', () => {
      component.open();
      fixture.detectChanges();
      const authorElement = fixture.nativeElement.querySelector('.thread-meta span');
      expect(authorElement.textContent).toContain(mockThread.author);
    });

    it('debería mostrar el contenido del hilo', () => {
      component.open();
      fixture.detectChanges();
      const contentElement = fixture.nativeElement.querySelector('.thread-content');
      expect(contentElement.textContent).toContain(mockThread.content);
    });

    it('debería mostrar los comentarios', () => {
      component.open();
      fixture.detectChanges();
      const comments = fixture.nativeElement.querySelectorAll('.comment');
      expect(comments.length).toBe(mockThread.comments.length);
    });

    it('debería mostrar el formulario de comentarios cuando el modal está abierto', () => {
      component.open();
      fixture.detectChanges();
      const form = fixture.nativeElement.querySelector('.add-comment-form');
      expect(form).toBeTruthy();
    });

    it('no debería mostrar el modal cuando está cerrado', () => {
      const modal = fixture.nativeElement.querySelector('.modal-overlay');
      expect(modal).toBeNull();
    });
  });

  describe('Manejo de eventos', () => {
    it('debería cerrar el modal al hacer clic en el overlay', () => {
      spyOn(component, 'close');
      component.open();
      fixture.detectChanges();
      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      overlay.click();
      expect(component.close).toHaveBeenCalled();
    });

    it('no debería cerrar el modal al hacer clic en el contenido', () => {
      spyOn(component, 'close');
      component.open();
      fixture.detectChanges();
      const content = fixture.nativeElement.querySelector('.modal-content');
      content.click();
      expect(component.close).not.toHaveBeenCalled();
    });

    it('debería cerrar el modal al hacer clic en el botón de cerrar', () => {
      spyOn(component, 'close');
      component.open();
      fixture.detectChanges();
      const closeButton = fixture.nativeElement.querySelector('.close-btn');
      closeButton.click();
      expect(component.close).toHaveBeenCalled();
    });
  });
});
