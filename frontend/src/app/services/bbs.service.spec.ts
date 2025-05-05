import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BbsService, CategoryDto, ThreadDto, ThreadSummaryDto, PostDto } from './bbs.service';
import { environment } from '../../environments/environment';

describe('BbsService', () => {
  let service: BbsService;
  let httpMock: HttpTestingController;
  const mockApiUrl = environment.bbsApiUrl || 'http://localhost:8080';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BbsService]
    });

    service = TestBed.inject(BbsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Category Operations', () => {
    const mockCategory: CategoryDto = {
      id: 1,
      name: 'Test Category',
      description: 'Test Description'
    };

    it('should get all categories', () => {
      const mockCategories: CategoryDto[] = [mockCategory];

      service.getAllCategories().subscribe(categories => {
        expect(categories).toEqual(mockCategories);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });

    it('should get category by id', () => {
      service.getCategoryById(1).subscribe(category => {
        expect(category).toEqual(mockCategory);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/categories/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategory);
    });

    it('should create category', () => {
      service.createCategory(mockCategory).subscribe(category => {
        expect(category).toEqual(mockCategory);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/categories`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCategory);
      req.flush(mockCategory);
    });

    it('should update category', () => {
      service.updateCategory(1, mockCategory).subscribe(category => {
        expect(category).toEqual(mockCategory);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/categories/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockCategory);
      req.flush(mockCategory);
    });

    it('should delete category', () => {
      service.deleteCategory(1).subscribe();

      const req = httpMock.expectOne(`${mockApiUrl}/api/categories/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('Thread Operations', () => {
    const mockThread: ThreadDto = {
      id: 1,
      title: 'Test Thread',
      createdAt: '2024-01-01',
      lastUpdatedAt: '2024-01-01',
      userId: 1,
      categoryId: 1,
      categoryName: 'Test Category',
      posts: []
    };

    const mockThreadSummary: ThreadSummaryDto = {
      id: 1,
      title: 'Test Thread',
      createdAt: '2024-01-01',
      lastUpdatedAt: '2024-01-01',
      userId: 1,
      categoryId: 1,
      postCount: 0
    };

    it('should get all threads', () => {
      const mockThreads: ThreadSummaryDto[] = [mockThreadSummary];

      service.getAllThreads().subscribe(threads => {
        expect(threads).toEqual(mockThreads);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/threads`);
      expect(req.request.method).toBe('GET');
      req.flush(mockThreads);
    });

    it('should get thread by id', () => {
      service.getThreadById(1).subscribe(thread => {
        expect(thread).toEqual(mockThread);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/threads/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockThread);
    });

    it('should get threads by category', () => {
      const mockThreads: ThreadSummaryDto[] = [mockThreadSummary];

      service.getThreadsByCategory(1).subscribe(threads => {
        expect(threads).toEqual(mockThreads);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/threads/category/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockThreads);
    });

    it('should create thread', () => {
      service.createThread(mockThread).subscribe(thread => {
        expect(thread).toEqual(mockThread);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/threads`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockThread);
      req.flush(mockThread);
    });

    it('should update thread', () => {
      service.updateThread(1, mockThread).subscribe(thread => {
        expect(thread).toEqual(mockThread);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/threads/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockThread);
      req.flush(mockThread);
    });

    it('should delete thread', () => {
      service.deleteThread(1).subscribe();

      const req = httpMock.expectOne(`${mockApiUrl}/api/threads/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should search threads', () => {
      const mockThreads: ThreadSummaryDto[] = [mockThreadSummary];
      const searchQuery = 'test';

      service.searchThreads(searchQuery).subscribe(threads => {
        expect(threads).toEqual(mockThreads);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/threads/search?query=test`);
      expect(req.request.method).toBe('GET');
      req.flush(mockThreads);
    });
  });

  describe('Post Operations', () => {
    const mockPost: PostDto = {
      id: 1,
      content: 'Test Post',
      createdAt: '2024-01-01',
      lastUpdatedAt: '2024-01-01',
      userId: 1,
      threadId: 1,
      threadTitle: 'Test Thread'
    };

    it('should get all posts', () => {
      const mockPosts: PostDto[] = [mockPost];

      service.getAllPosts().subscribe(posts => {
        expect(posts).toEqual(mockPosts);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/posts`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);
    });

    it('should get post by id', () => {
      service.getPostById(1).subscribe(post => {
        expect(post).toEqual(mockPost);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/posts/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPost);
    });

    it('should get posts by thread', () => {
      const mockPosts: PostDto[] = [mockPost];

      service.getPostsByThread(1).subscribe(posts => {
        expect(posts).toEqual(mockPosts);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/posts/thread/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);
    });

    it('should get posts by user', () => {
      const mockPosts: PostDto[] = [mockPost];

      service.getPostsByUser(1).subscribe(posts => {
        expect(posts).toEqual(mockPosts);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/posts/user/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);
    });

    it('should create post', () => {
      service.createPost(mockPost).subscribe(post => {
        expect(post).toEqual(mockPost);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/posts`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPost);
      req.flush(mockPost);
    });

    it('should update post', () => {
      service.updatePost(1, mockPost).subscribe(post => {
        expect(post).toEqual(mockPost);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/posts/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockPost);
      req.flush(mockPost);
    });

    it('should delete post', () => {
      service.deletePost(1).subscribe();

      const req = httpMock.expectOne(`${mockApiUrl}/api/posts/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should search posts', () => {
      const mockPosts: PostDto[] = [mockPost];
      const searchQuery = 'test';

      service.searchPosts(searchQuery).subscribe(posts => {
        expect(posts).toEqual(mockPosts);
      });

      const req = httpMock.expectOne(`${mockApiUrl}/api/posts/search?query=test`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);
    });
  });
});
