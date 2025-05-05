import { Component, ViewChild, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { NewThreadModalComponent } from './new-thread-modal/new-thread-modal.component';
import { ThreadDetailsModalComponent } from './thread-details-modal/thread-details-modal.component';
import { Subscription } from 'rxjs';
import { BbsService, CategoryDto, ThreadDto, ThreadSummaryDto, PostDto } from '../../services/bbs.service';
import { AuthService } from '../../services/auth.service';

interface Thread {
  id: number;
  title: string;
  author: string;
  lastActivity: string;
  replies: number;
  views: number;
  isSticky?: boolean;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  threads: Thread[];
  isExpanded?: boolean;
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

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, UserAvatarComponent, NewThreadModalComponent, ThreadDetailsModalComponent]
})
export class ForumComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(NewThreadModalComponent) modal!: NewThreadModalComponent;
  @ViewChild(ThreadDetailsModalComponent) threadModal!: ThreadDetailsModalComponent;

  private commentSubscription?: Subscription;
  private categoriesSubscription?: Subscription;
  private threadsSubscription?: Subscription;
  private currentUserSubscription?: Subscription;

  currentPage: number = 1;
  totalPages: number = 5;
  threadsPerPage: number = 10;

  categories: Category[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  selectedCategoryId: number | null = null;
  currentUserId: number | null = null;

  constructor(
    private bbsService: BbsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUserSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.id || null;
    });
    this.loadCategories();
  }

  private loadCategories() {
    this.isLoading = true;
    this.error = null;

    this.categoriesSubscription = this.bbsService.getAllCategories().subscribe({
      next: (apiCategories: CategoryDto[]) => {
        this.categories = apiCategories.map(category => ({
          id: category.id,
          name: category.name,
          description: category.description,
          icon: this.getCategoryIcon(category.name),
          isExpanded: false,
          threads: []
        }));

        // Load threads for each category
        this.categories.forEach(category => {
          this.loadThreadsForCategory(category.id);
        });
      },
      error: (err) => {
        this.error = 'Error loading categories. Please try again later.';
        this.isLoading = false;
        console.error('Error loading categories:', err);
      }
    });
  }

  private loadThreadsForCategory(categoryId: number) {
    this.threadsSubscription = this.bbsService.getThreadsByCategory(categoryId).subscribe({
      next: (apiThreads: ThreadSummaryDto[]) => {
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
          category.threads = apiThreads.map(thread => ({
            id: thread.id,
            title: thread.title,
            author: `User${thread.userId}`,
            lastActivity: thread.lastUpdatedAt,
            replies: thread.postCount - 1, // Subtract 1 for the original post
            views: Math.floor(Math.random() * 1000), // Random views for now
            createdAt: thread.createdAt
          }));
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error loading threads. Please try again later.';
        this.isLoading = false;
        console.error('Error loading threads:', err);
      }
    });
  }

  private getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'Tecnología': 'computer',
      'Programación': 'code',
      'Diseño': 'design_services',
      'Ciencia': 'science',
      'General': 'forum'
    };
    return iconMap[categoryName] || 'forum';
  }

  isNewThread(thread: Thread): boolean {
    const threadDate = new Date(thread.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - threadDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }

  isHotThread(thread: Thread): boolean {
    return thread.replies >= 20;
  }

  toggleCategory(categoryId: number): void {
    const category = this.categories.find(c => c.id === categoryId);
    if (category) {
      category.isExpanded = !category.isExpanded;
    }
  }

  createNewThread(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.modal.open();
  }

  openThreadDetails(thread: Thread): void {
    this.bbsService.getThreadById(thread.id).subscribe({
      next: (apiThread: ThreadDto) => {
        const threadDetails: ThreadDetails = {
          id: apiThread.id,
          title: apiThread.title,
          author: `User${apiThread.userId}`,
          content: apiThread.posts && apiThread.posts.length > 0 ? apiThread.posts[0]?.content : '',
          lastActivity: apiThread.lastUpdatedAt,
          replies: apiThread.posts?.length || 0,
          views: Math.floor(Math.random() * 1000),
          createdAt: apiThread.createdAt,
          comments: apiThread.posts?.slice(1).map(post => ({
            id: post.id,
            author: `User${post.userId}`,
            content: post.content,
            createdAt: post.createdAt
          })) || []
        };
        this.threadModal.thread = threadDetails;
        this.threadModal.open();
      },
      error: (err) => {
        console.error('Error loading thread details:', err);
      }
    });
  }

  ngAfterViewInit() {
    if (this.modal) {
      this.modal.createThread.subscribe((threadData: {title: string, content: string}) => {
        if (this.selectedCategoryId && this.currentUserId) {
          const thread: ThreadDto = {
            id: 0,
            title: threadData.title,
            createdAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
            userId: this.currentUserId,
            categoryId: this.selectedCategoryId,
            categoryName: '',
            posts: [{
              id: 0,
              content: threadData.content,
              createdAt: new Date().toISOString(),
              lastUpdatedAt: new Date().toISOString(),
              userId: this.currentUserId,
              threadId: 0,
              threadTitle: threadData.title
            }]
          };

          this.bbsService.createThread(thread).subscribe({
            next: (createdThread) => {
              const category = this.categories.find(c => c.id === this.selectedCategoryId);
              if (category) {
                category.threads.unshift({
                  id: createdThread.id,
                  title: createdThread.title,
                  author: `User${createdThread.userId}`,
                  lastActivity: createdThread.lastUpdatedAt,
                  replies: 0,
                  views: 0,
                  createdAt: createdThread.createdAt
                });
              }
            },
            error: (err) => {
              console.error('Error creating thread:', err);
            }
          });
        }
      });
    }
  }

  onAddComment(event: {threadId: number, content: string}) {
    if (!this.currentUserId) {
      console.error('No user ID available');
      return;
    }

    this.threadModal.isSubmitting = true;
    const newPost: PostDto = {
      id: 0,
      content: event.content,
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      userId: this.currentUserId,
      threadId: event.threadId,
      threadTitle: this.threadModal.thread?.title || ''
    };

    this.bbsService.createPost(newPost).subscribe({
      next: (response) => {
        this.loadThreadDetails(event.threadId);
        this.threadModal.newComment = '';
        this.threadModal.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error creating comment:', error);
        this.threadModal.error = 'Error al publicar el comentario. Por favor, intenta nuevamente.';
        this.threadModal.isSubmitting = false;
      }
    });
  }

  private loadThreadDetails(threadId: number) {
    this.bbsService.getThreadById(threadId).subscribe({
      next: (thread) => {
        if (this.threadModal.thread?.id === threadId) {
          this.threadModal.thread = {
            id: thread.id,
            title: thread.title,
            author: 'Usuario ' + thread.userId,
            content: thread.posts[0]?.content || '',
            lastActivity: thread.lastUpdatedAt,
            replies: thread.posts.length - 1,
            views: 0,
            createdAt: thread.createdAt,
            comments: thread.posts.slice(1).map(post => ({
              id: post.id,
              author: 'Usuario ' + post.userId,
              content: post.content,
              createdAt: post.createdAt
            }))
          };
        }
      },
      // error: (error) => {
      //   console.error('Error loading thread details:', error);
      // }
    });
  }

  ngOnDestroy() {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
    if (this.threadsSubscription) {
      this.threadsSubscription.unsubscribe();
    }
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }
}
