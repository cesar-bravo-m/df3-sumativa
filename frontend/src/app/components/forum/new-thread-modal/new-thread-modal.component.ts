import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostDto, ThreadDto } from '../../../services/bbs.service';

@Component({
  selector: 'app-new-thread-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Nuevo Tema</h2>
          <button class="close-btn" (click)="close()">×</button>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="submitThread()">
            <div class="form-group">
              <label for="title">Título</label>
              <input type="text" id="title" [(ngModel)]="threadTitle" name="title" required>
            </div>
            <!-- <div class="form-group">
              <label for="content">Contenido</label>
              <textarea id="content" [(ngModel)]="threadContent" name="content" required></textarea>
            </div> -->
            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="close()">Cancelar</button>
              <button type="submit" class="submit-btn">Crear Tema</button>
            </div>
          </form>
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
      max-width: 600px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }

    input, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    textarea {
      min-height: 150px;
      resize: vertical;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    .cancel-btn, .submit-btn {
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }

    .cancel-btn {
      background: #f0f0f0;
      border: 1px solid #ddd;
    }

    .submit-btn {
      background: #007bff;
      color: white;
      border: none;
    }

    .submit-btn:hover {
      background: #0056b3;
    }
  `]
})
export class NewThreadModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() createThread = new EventEmitter<ThreadDto>();

  isOpen = false;
  threadTitle = '';
  threadContent = '';

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.threadTitle = '';
    this.threadContent = '';
    this.closeModal.emit();
  }

  submitThread() {
    // if (this.threadTitle && this.threadContent) {
    if (this.threadTitle) {
      this.createThread.emit({
        title: this.threadTitle,
        posts: [
          {
            id: 0,
            content: this.threadContent,
            createdAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
            userId: 0,
            threadId: 0,
            threadTitle: this.threadTitle
          }
        ]
      } as ThreadDto);
      this.close();
      setTimeout(window.location.reload, 1000);
    }
  }
}
