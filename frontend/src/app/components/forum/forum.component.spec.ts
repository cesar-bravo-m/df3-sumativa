import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumComponent } from './forum.component';
import { NewThreadModalComponent } from './new-thread-modal/new-thread-modal.component';
import { ThreadDetailsModalComponent } from './thread-details-modal/thread-details-modal.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ForumComponent', () => {
  let component: ForumComponent;
  let fixture: ComponentFixture<ForumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        UserAvatarComponent,
        NewThreadModalComponent,
        ThreadDetailsModalComponent,
        ForumComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  describe('Gestión de categorías', () => {
    it('debería alternar el estado de expansión de la categoría', () => {
      const initialExpandedState = component.categories[0].isExpanded;
      component.toggleCategory(1);
      expect(component.categories[0].isExpanded).toBe(!initialExpandedState);
    });

    it('no debería modificar una categoría inexistente', () => {
      const initialCategories = [...component.categories];
      component.toggleCategory(999);
      expect(component.categories).toEqual(initialCategories);
    });
  });

  describe('Gestión de hilos', () => {
    it('debería identificar correctamente los nuevos hilos', () => {
      const newThread = {
        id: 1,
        title: 'New Thread',
        author: 'Test User',
        lastActivity: '2024-03-20',
        replies: 0,
        views: 0,
        createdAt: new Date().toISOString()
      };
      expect(component.isNewThread(newThread)).toBe(true);
    });

    it('debería identificar correctamente los hilos populares', () => {
      const hotThread = {
        id: 1,
        title: 'Hot Thread',
        author: 'Test User',
        lastActivity: '2024-03-20',
        replies: 25,
        views: 600,
        createdAt: '2024-03-15'
      };
      expect(component.isHotThread(hotThread)).toBe(true);
    });

    it('debería crear un nuevo hilo en la categoría correcta', () => {
      const categoryId = 1;
      const initialThreadCount = component.categories[0].threads.length;

      component.createNewThread(categoryId);
      component.modal.createThread.next({
        title: 'Test Thread',
        content: 'Test Content'
      });

      expect(component.categories[0].threads.length).toBe(initialThreadCount + 1);
      const newThread = component.categories[0].threads[0];
      expect(newThread.title).toBe('Test Thread');
      expect(newThread.replies).toBe(0);
      expect(newThread.views).toBe(0);
    });
  });

  describe('Detalles del hilo', () => {
    it('debería abrir los detalles del hilo con los datos correctos', () => {
      const thread = component.categories[0].threads[0];
      component.openThreadDetails(thread);

      const threadDetails = component.threadModal.thread;
      expect(threadDetails).toBeDefined();
      if (threadDetails) {
        expect(threadDetails.id).toBe(thread.id);
        expect(threadDetails.title).toBe(thread.title);
        expect(threadDetails.comments).toBeDefined();
      }
    });

    it('debería generar comentarios de marcador de posición', () => {
      const thread = component.categories[0].threads[0];
      const comments = component.generatePlaceholderComments(thread);

      expect(comments.length).toBeGreaterThanOrEqual(3);
      expect(comments.length).toBeLessThanOrEqual(7);
      expect(comments[0].id).toBeDefined();
      expect(comments[0].author).toBeDefined();
      expect(comments[0].content).toBeDefined();
      expect(comments[0].createdAt).toBeDefined();
    });
  });

  describe('Manejo de comentarios', () => {
    it('debería manejar correctamente los nuevos comentarios', () => {
      const thread = component.categories[0].threads[0];
      component.openThreadDetails(thread);

      const threadDetails = component.threadModal.thread;
      expect(threadDetails).toBeDefined();
      if (threadDetails) {
        const initialReplyCount = threadDetails.replies;
        const newComment = {
          id: 999,
          author: 'Test User',
          content: 'Test Comment',
          createdAt: new Date().toISOString()
        };

        component.threadModal.addNewComment.next(newComment);

        expect(threadDetails.replies).toBe(initialReplyCount + 1);
        expect(threadDetails.comments).toContain(newComment);
      }
    });
  });

  describe('Ciclo de vida del componente', () => {
    it('debería cancelar la suscripción a los comentarios al destruir', () => {
      const thread = component.categories[0].threads[0];
      component.openThreadDetails(thread);

      // Access the subscription through the component's public interface
      const subscription = (component as any).commentSubscription as Subscription;
      expect(subscription).toBeDefined();

      component.ngOnDestroy();
      expect(subscription.closed).toBe(true);
    });
  });

  describe('Paginación', () => {
    it('debería tener los valores de paginación iniciales correctos', () => {
      expect(component.currentPage).toBe(1);
      expect(component.totalPages).toBe(5);
      expect(component.threadsPerPage).toBe(10);
    });
  });
});
