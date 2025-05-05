import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CategoryDto {
  id: number;
  name: string;
  description: string;
  threads?: ThreadSummaryDto[];
}

export interface ThreadSummaryDto {
  id: number;
  title: string;
  createdAt: string;
  lastUpdatedAt: string;
  userId: number;
  categoryId: number;
  postCount: number;
}

export interface ThreadDto {
  id: number;
  title: string;
  createdAt: string;
  lastUpdatedAt: string;
  userId: number;
  categoryId: number;
  categoryName: string;
  posts: PostDto[];
}

export interface PostDto {
  id: number;
  content: string;
  createdAt: string;
  lastUpdatedAt: string;
  userId: number;
  threadId: number;
  threadTitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class BbsService {
  private apiUrl = environment.bbsApiUrl || 'http://localhost:8081';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(`${this.apiUrl}/api/categories`);
  }

  getCategoryById(id: number): Observable<CategoryDto> {
    return this.http.get<CategoryDto>(`${this.apiUrl}/api/categories/${id}`);
  }

  createCategory(category: CategoryDto): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(`${this.apiUrl}/api/categories`, category);
  }

  updateCategory(id: number, category: CategoryDto): Observable<CategoryDto> {
    return this.http.put<CategoryDto>(`${this.apiUrl}/api/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/categories/${id}`);
  }

  getAllThreads(): Observable<ThreadSummaryDto[]> {
    return this.http.get<ThreadSummaryDto[]>(`${this.apiUrl}/api/threads`);
  }

  getThreadById(id: number): Observable<ThreadDto> {
    return this.http.get<ThreadDto>(`${this.apiUrl}/api/threads/${id}`);
  }

  getThreadsByCategory(categoryId: number): Observable<ThreadSummaryDto[]> {
    return this.http.get<ThreadSummaryDto[]>(`${this.apiUrl}/api/threads/category/${categoryId}`);
  }

  createThread(thread: ThreadDto): Observable<ThreadDto> {
    return this.http.post<ThreadDto>(`${this.apiUrl}/api/threads`, thread);
  }

  updateThread(id: number, thread: ThreadDto): Observable<ThreadDto> {
    return this.http.put<ThreadDto>(`${this.apiUrl}/api/threads/${id}`, thread);
  }

  deleteThread(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/threads/${id}`);
  }

  searchThreads(query: string): Observable<ThreadSummaryDto[]> {
    return this.http.get<ThreadSummaryDto[]>(`${this.apiUrl}/api/threads/search`, {
      params: { query }
    });
  }

  getAllPosts(): Observable<PostDto[]> {
    return this.http.get<PostDto[]>(`${this.apiUrl}/api/posts`);
  }

  getPostById(id: number): Observable<PostDto> {
    return this.http.get<PostDto>(`${this.apiUrl}/api/posts/${id}`);
  }

  getPostsByThread(threadId: number): Observable<PostDto[]> {
    return this.http.get<PostDto[]>(`${this.apiUrl}/api/posts/thread/${threadId}`);
  }

  getPostsByUser(userId: number): Observable<PostDto[]> {
    return this.http.get<PostDto[]>(`${this.apiUrl}/api/posts/user/${userId}`);
  }

  createPost(post: PostDto): Observable<PostDto> {
    return this.http.post<PostDto>(`${this.apiUrl}/api/posts`, post);
  }

  updatePost(id: number, post: PostDto): Observable<PostDto> {
    return this.http.put<PostDto>(`${this.apiUrl}/api/posts/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/posts/${id}`);
  }

  searchPosts(query: string): Observable<PostDto[]> {
    return this.http.get<PostDto[]>(`${this.apiUrl}/api/posts/search`, {
      params: { query }
    });
  }

  // decodeToken(token: string): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/api/jwt/decode`, { token });
  // }

  // generateToken(username?: string): Observable<string> {
  //   return this.http.get<string>(`${this.apiUrl}/api/jwt/generate`, {
  //     params: username ? { username } : {}
  //   });
  // }

  // generateNormalUserToken(username?: string, userId?: number): Observable<string> {
  //   const params: any = {};
  //   if (username) params.username = username;
  //   if (userId) params.userId = userId;
  //   return this.http.get<string>(`${this.apiUrl}/api/jwt/generate/normal-user`, { params });
  // }

  // generateModeratorToken(username?: string, userId?: number): Observable<string> {
  //   const params: any = {};
  //   if (username) params.username = username;
  //   if (userId) params.userId = userId;
  //   return this.http.get<string>(`${this.apiUrl}/api/jwt/generate/moderator`, { params });
  // }
}
