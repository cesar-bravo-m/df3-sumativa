import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
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

@Component({
  selector: 'app-thread-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{thread?.title}}</h2>
          <button class="close-btn" (click)="close()">×</button>
        </div>
        <div class="modal-body">
          <div class="thread-info">
            <div class="thread-meta">
              <span>Autor: {{thread?.author}}</span>
              <span>Fecha: {{thread?.createdAt | date:'dd/MM/yyyy'}}</span>
              <span>Vistas: {{thread?.views}}</span>
              <span>Respuestas: {{thread?.replies}}</span>
            </div>
            <div class="thread-content">
              {{thread?.content}}
            </div>
          </div>

          <div class="comments-section">
            <h3>Comentarios ({{thread?.comments?.length || 0}})</h3>
            <div class="comment" *ngFor="let comment of thread?.comments">
              <div class="comment-header">
                <span class="comment-author">{{comment.author}}</span>
                <span class="comment-date">{{comment.createdAt | date:'dd/MM/yyyy HH:mm'}}</span>
              </div>
              <div class="comment-content">
                {{comment.content}}
              </div>
            </div>

            <div class="add-comment-form">
              <h4>Añadir Comentario</h4>
              <form (ngSubmit)="addComment()">
                <div class="form-group">
                  <textarea
                    [(ngModel)]="newComment"
                    name="comment"
                    placeholder="Escribe tu comentario aquí..."
                    [disabled]="isSubmitting"
                    required></textarea>
                </div>
                <div class="error-message" *ngIf="error">{{error}}</div>
                <button type="submit" class="submit-btn" [disabled]="isSubmitting">
                  {{isSubmitting ? 'Publicando...' : 'Publicar Comentario'}}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }

    .thread-info {
      margin-bottom: 30px;
    }

    .thread-meta {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
      color: #666;
      font-size: 0.9em;
    }

    .thread-content {
      padding: 15px;
      background: #f9f9f9;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .comments-section {
      margin-top: 20px;
    }

    .comment {
      border-bottom: 1px solid #eee;
      padding: 15px 0;
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      color: #666;
      font-size: 0.9em;
    }

    .comment-content {
      line-height: 1.5;
    }

    .add-comment-form {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .add-comment-form h4 {
      margin-bottom: 15px;
    }

    .add-comment-form textarea {
      width: 100%;
      min-height: 100px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
      margin-bottom: 15px;
    }

    .add-comment-form .submit-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }

    .add-comment-form .submit-btn:hover {
      background: #0056b3;
    }

    .add-comment-form .submit-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .error-message {
      color: #dc3545;
      margin-bottom: 10px;
      font-size: 0.9em;
    }
  `]
})
export class ThreadDetailsModalComponent implements OnChanges {
  @Input() thread?: ThreadDetails;
  @Input() currentUserId?: number;
  @Input() currentUsername?: string;
  @Output() closeModal = new EventEmitter<void>();
  @Output() addNewComment = new EventEmitter<{threadId: number, content: string}>();

  isOpen = false;
  newComment = '';
  isSubmitting = false;
  error: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['thread'] && this.thread) {
      if (!this.thread.comments) {
        this.thread.comments = [];
      }
    }
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.newComment = '';
    this.error = null;
    this.closeModal.emit();
  }

  addComment() {
    if (!this.newComment.trim() || !this.thread) {
      this.error = 'Por favor, escribe un comentario.';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    this.addNewComment.emit({
      threadId: this.thread.id,
      content: this.newComment.trim()
    });
  }
}
