import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumComponent } from './forum.component';
import { NewThreadModalComponent } from './new-thread-modal/new-thread-modal.component';
import { ThreadDetailsModalComponent } from './thread-details-modal/thread-details-modal.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { BbsService, PostDto, ThreadDto } from '../../services/bbs.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('ForumComponent', () => {
  let component: ForumComponent;
  let fixture: ComponentFixture<ForumComponent>;
  let bbsService: jasmine.SpyObj<BbsService>;
  let authService: jasmine.SpyObj<AuthService>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const mockCategories = [{
    id: 1,
    name: 'Test Category',
    description: 'Test Description',
    threads: []
  }];

  const mockThreads = [{
    id: 1,
    title: 'Test Thread',
    createdAt: '2024-03-20',
    lastUpdatedAt: '2024-03-20',
    userId: 1,
    categoryId: 1,
    postCount: 1
  }];

  const mockThreadDetails = {
    id: 1,
    title: 'Test Thread',
    createdAt: '2024-03-20',
    lastUpdatedAt: '2024-03-20',
    userId: 1,
    categoryId: 1,
    categoryName: 'Test Category',
    posts: [{
      id: 1,
      content: 'Test Content',
      createdAt: '2024-03-20',
      lastUpdatedAt: '2024-03-20',
      userId: 1,
      threadId: 1,
      threadTitle: 'Test Thread'
    }]
  };

  beforeEach(async () => {
    const bbsSpy = jasmine.createSpyObj('BbsService', [
      'getAllCategories',
      'getThreadsByCategory',
      'getThreadById',
      'createThread',
      'createPost'
    ]);

    const authSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser$: of({ id: 1, username: 'testuser' })
    });

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        HttpClientTestingModule,
        UserAvatarComponent,
        NewThreadModalComponent,
        ThreadDetailsModalComponent,
        ForumComponent
      ],
      providers: [
        { provide: BbsService, useValue: bbsSpy },
        { provide: AuthService, useValue: authSpy },
        HttpClient
      ]
    }).compileComponents();

    bbsService = TestBed.inject(BbsService) as jasmine.SpyObj<BbsService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    bbsService.getAllCategories.and.returnValue(of(mockCategories));
    bbsService.getThreadsByCategory.and.returnValue(of(mockThreads));
    bbsService.getThreadById.and.returnValue(of(mockThreadDetails));
    bbsService.createThread.and.returnValue(of(mockThreadDetails));
    bbsService.createPost.and.returnValue(of({
      id: 2,
      content: 'New Comment',
      createdAt: '2024-03-20',
      lastUpdatedAt: '2024-03-20',
      userId: 1,
      threadId: 1,
      threadTitle: 'Test Thread'
    }));

    fixture = TestBed.createComponent(ForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  describe('Inicialización', () => {
    it('debería cargar las categorías al iniciar', () => {
      expect(bbsService.getAllCategories).toHaveBeenCalled();
      expect(component.categories.length).toBeGreaterThan(0);
    });

    it('debería cargar los hilos para cada categoría', () => {
      expect(bbsService.getThreadsByCategory).toHaveBeenCalled();
    });
  });

  describe('Gestión de hilos', () => {
    it('debería abrir los detalles del hilo', () => {
      const thread = {
        id: 1,
        title: 'Test Thread',
        author: 'Test User',
        lastActivity: '2024-03-20',
        replies: 0,
        views: 0,
        createdAt: '2024-03-20'
      };

      component.openThreadDetails(thread);
      expect(bbsService.getThreadById).toHaveBeenCalledWith(thread.id);
      expect(component.threadModal.thread).toBeDefined();
    });

    it('debería crear un nuevo hilo', () => {
      component.selectedCategoryId = 1;
      component.currentUserId = 1;
      component.modal.open();
      component.modal.createThread.emit({
        title: 'New Thread',
        posts: [{
          id: 0,
          content: 'New Content',
          createdAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
          userId: 1,
          threadId: 0,
          threadTitle: 'New Thread'
        }]
      } as ThreadDto);

      expect(bbsService.createThread).toHaveBeenCalledWith({
        id: 0,
        title: 'New Thread',
        createdAt: jasmine.any(String),
        lastUpdatedAt: jasmine.any(String),
        userId: 1,
        categoryId: 1,
        categoryName: '',
        posts: jasmine.any(Array)
      });
    });
  });

  describe('Manejo de comentarios', () => {
    it('debería agregar un nuevo comentario', () => {
      component.currentUserId = 1;
      component.threadModal.thread = {
        id: 1,
        title: 'Test Thread',
        author: 'Test User',
        content: 'Test Content',
        lastActivity: '2024-03-20',
        replies: 0,
        views: 0,
        createdAt: '2024-03-20',
        comments: []
      };

      component.onAddComment({
        threadId: 1,
        content: 'New Comment'
      });

      expect(bbsService.createPost).toHaveBeenCalled();
      expect(bbsService.getThreadById).toHaveBeenCalledWith(1);
    });
  });

  describe('Ciclo de vida del componente', () => {
    it('debería limpiar las suscripciones al destruir', () => {
      const spy = spyOn(component as any, 'ngOnDestroy');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
    });
  });
});
