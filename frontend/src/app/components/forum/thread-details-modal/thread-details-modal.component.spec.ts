import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThreadDetailsModalComponent } from './thread-details-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      // declarations: [ThreadDetailsModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ThreadDetailsModalComponent);
    component = fixture.componentInstance;
    component.thread = mockThread;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with closed state', () => {
      expect(component.isOpen).toBeFalse();
    });

    it('should initialize with empty newComment', () => {
      expect(component.newComment).toBe('');
    });

    it('should initialize comments array if not present', () => {
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

  describe('Modal State Management', () => {
    it('should open modal', () => {
      component.open();
      expect(component.isOpen).toBeTrue();
    });

    it('should close modal and emit closeModal event', () => {
      spyOn(component.closeModal, 'emit');
      component.open();
      component.close();
      expect(component.isOpen).toBeFalse();
      expect(component.newComment).toBe('');
      expect(component.closeModal.emit).toHaveBeenCalled();
    });
  });

  describe('Comment Management', () => {
    it('should add new comment and emit addNewComment event', () => {
      spyOn(component.addNewComment, 'emit');
      component.newComment = 'New Test Comment';
      component.addComment();
      expect(component.addNewComment.emit).toHaveBeenCalledWith({
        id: mockThread.comments.length + 1,
        author: 'Usuario Actual',
        content: 'New Test Comment',
        createdAt: jasmine.any(String)
      });
      expect(component.newComment).toBe('');
    });

    it('should not add empty comment', () => {
      spyOn(component.addNewComment, 'emit');
      component.newComment = '   ';
      component.addComment();
      expect(component.addNewComment.emit).not.toHaveBeenCalled();
    });

    it('should not add comment if thread is undefined', () => {
      spyOn(component.addNewComment, 'emit');
      component.thread = undefined;
      component.newComment = 'New Test Comment';
      component.addComment();
      expect(component.addNewComment.emit).not.toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    it('should display thread title', () => {
      component.open();
      fixture.detectChanges();
      const titleElement = fixture.nativeElement.querySelector('h2');
      expect(titleElement.textContent).toContain(mockThread.title);
    });

    it('should display thread author', () => {
      component.open();
      fixture.detectChanges();
      const authorElement = fixture.nativeElement.querySelector('.thread-meta span');
      expect(authorElement.textContent).toContain(mockThread.author);
    });

    it('should display thread content', () => {
      component.open();
      fixture.detectChanges();
      const contentElement = fixture.nativeElement.querySelector('.thread-content');
      expect(contentElement.textContent).toContain(mockThread.content);
    });

    it('should display comments', () => {
      component.open();
      fixture.detectChanges();
      const comments = fixture.nativeElement.querySelectorAll('.comment');
      expect(comments.length).toBe(mockThread.comments.length);
    });

    it('should display comment form when modal is open', () => {
      component.open();
      fixture.detectChanges();
      const form = fixture.nativeElement.querySelector('.add-comment-form');
      expect(form).toBeTruthy();
    });

    it('should not display modal when closed', () => {
      const modal = fixture.nativeElement.querySelector('.modal-overlay');
      expect(modal).toBeNull();
    });
  });

  describe('Event Handling', () => {
    it('should close modal when clicking overlay', () => {
      spyOn(component, 'close');
      component.open();
      fixture.detectChanges();
      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      overlay.click();
      expect(component.close).toHaveBeenCalled();
    });

    it('should not close modal when clicking content', () => {
      spyOn(component, 'close');
      component.open();
      fixture.detectChanges();
      const content = fixture.nativeElement.querySelector('.modal-content');
      content.click();
      expect(component.close).not.toHaveBeenCalled();
    });

    it('should close modal when clicking close button', () => {
      spyOn(component, 'close');
      component.open();
      fixture.detectChanges();
      const closeButton = fixture.nativeElement.querySelector('.close-btn');
      closeButton.click();
      expect(component.close).toHaveBeenCalled();
    });
  });
});
