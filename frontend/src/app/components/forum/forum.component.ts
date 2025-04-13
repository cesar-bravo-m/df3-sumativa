import { Component, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { NewThreadModalComponent } from './new-thread-modal/new-thread-modal.component';
import { ThreadDetailsModalComponent } from './thread-details-modal/thread-details-modal.component';
import { Subscription } from 'rxjs';

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
export class ForumComponent implements OnDestroy, AfterViewInit {
  @ViewChild(NewThreadModalComponent) modal!: NewThreadModalComponent;
  @ViewChild(ThreadDetailsModalComponent) threadModal!: ThreadDetailsModalComponent;

  private commentSubscription?: Subscription;

  currentPage: number = 1;
  totalPages: number = 5;
  threadsPerPage: number = 10;

  categories: Category[] = [
    {
      id: 1,
      name: 'Tecnología',
      description: 'Discusiones abiertas sobre cualquier tema',
      icon: 'computer',
      isExpanded: true,
      threads: [
        {
          id: 1,
          title: '¡Bienvenido a nuestra comunidad!',
          author: 'Administrador',
          lastActivity: '2024-03-20',
          replies: 15,
          views: 234,
          isSticky: true,
          createdAt: '2024-03-15'
        },
        {
          id: 2,
          title: '¿Qué te trae por aquí?',
          author: 'Moderador',
          lastActivity: '2024-03-19',
          replies: 28,
          views: 456,
          createdAt: '2024-03-10'
        },
        {
          id: 3,
          title: 'Pautas de la Comunidad',
          author: 'Administrador',
          lastActivity: '2024-03-18',
          replies: 5,
          views: 789,
          isSticky: true,
          createdAt: '2024-03-01'
        },
        {
          id: 4,
          title: '¡Preséntate!',
          author: 'Moderador',
          lastActivity: '2024-03-17',
          replies: 42,
          views: 567,
          createdAt: '2024-03-05'
        }
      ]
    },
    {
      id: 2,
      name: 'Programación',
      description: 'Obtén ayuda con problemas técnicos',
      icon: 'code',
      isExpanded: false,
      threads: [
        {
          id: 5,
          title: 'Pasos comunes de solución de problemas',
          author: 'SoporteTécnico',
          lastActivity: '2024-03-20',
          replies: 12,
          views: 345,
          createdAt: '2024-03-18'
        },
        {
          id: 6,
          title: 'Cómo restablecer tu contraseña',
          author: 'Administrador',
          lastActivity: '2024-03-19',
          replies: 8,
          views: 234,
          isSticky: true,
          createdAt: '2024-03-01'
        },
        {
          id: 7,
          title: 'Problemas de compatibilidad con navegadores',
          author: 'SoporteTécnico',
          lastActivity: '2024-03-18',
          replies: 15,
          views: 456,
          createdAt: '2024-03-15'
        },
        {
          id: 8,
          title: 'Soporte para aplicación móvil',
          author: 'DesarrolladorMóvil',
          lastActivity: '2024-03-17',
          replies: 23,
          views: 678,
          createdAt: '2024-03-12'
        },
        {
          id: 9,
          title: 'Ayuda con documentación de API',
          author: 'SoporteTécnico',
          lastActivity: '2024-03-16',
          replies: 18,
          views: 432,
          createdAt: '2024-03-14'
        }
      ]
    },
    {
      id: 3,
      name: 'Diseño',
      description: 'Sugiere y discute nuevas funciones',
      icon: 'design_services',
      isExpanded: false,
      threads: [
        {
          id: 10,
          title: 'Sugerencia de modo oscuro',
          author: 'Usuario123',
          lastActivity: '2024-03-20',
          replies: 45,
          views: 567,
          createdAt: '2024-03-18'
        },
        {
          id: 11,
          title: 'Mejoras para la aplicación móvil',
          author: 'UsuarioMóvil',
          lastActivity: '2024-03-19',
          replies: 32,
          views: 432,
          createdAt: '2024-03-15'
        },
        {
          id: 12,
          title: 'Ideas para nuevas integraciones',
          author: 'UsuarioAvanzado',
          lastActivity: '2024-03-18',
          replies: 28,
          views: 345,
          createdAt: '2024-03-14'
        },
        {
          id: 13,
          title: 'Mejoras de interfaz y experiencia',
          author: 'Diseñador',
          lastActivity: '2024-03-17',
          replies: 36,
          views: 489,
          createdAt: '2024-03-13'
        },
        {
          id: 14,
          title: 'Ideas para optimización de rendimiento',
          author: 'UsuarioTécnico',
          lastActivity: '2024-03-16',
          replies: 19,
          views: 234,
          createdAt: '2024-03-12'
        },
        {
          id: 15,
          title: 'Funciones de accesibilidad',
          author: 'DefensorAccesibilidad',
          lastActivity: '2024-03-15',
          replies: 25,
          views: 345,
          createdAt: '2024-03-11'
        }
      ]
    },
    {
      id: 4,
      name: 'Ciencia',
      description: 'Actualizaciones y noticias importantes',
      icon: 'science',
      isExpanded: false,
      threads: [
        {
          id: 16,
          title: 'Nueva versión de funciones: Marzo 2024',
          author: 'Administrador',
          lastActivity: '2024-03-20',
          replies: 8,
          views: 567,
          isSticky: true,
          createdAt: '2024-03-19'
        },
        {
          id: 17,
          title: 'Aviso de mantenimiento del sistema',
          author: 'Administrador',
          lastActivity: '2024-03-19',
          replies: 3,
          views: 432,
          isSticky: true,
          createdAt: '2024-03-18'
        },
        {
          id: 18,
          title: '¡Hito de la comunidad alcanzado!',
          author: 'Moderador',
          lastActivity: '2024-03-18',
          replies: 15,
          views: 678,
          createdAt: '2024-03-17'
        },
        {
          id: 19,
          title: 'Anuncio de nuevo moderador',
          author: 'Administrador',
          lastActivity: '2024-03-17',
          replies: 12,
          views: 345,
          createdAt: '2024-03-16'
        }
      ]
    },
    {
      id: 5,
      name: 'Películas',
      description: 'Comparte tu trabajo y logros',
      icon: 'theaters',
      isExpanded: false,
      threads: [
        {
          id: 20,
          title: 'Mi primera muestra de proyecto',
          author: 'UsuarioNuevo',
          lastActivity: '2024-03-20',
          replies: 18,
          views: 234,
          createdAt: '2024-03-19'
        },
        {
          id: 21,
          title: 'Destacados de la comunidad: Febrero 2024',
          author: 'Moderador',
          lastActivity: '2024-03-19',
          replies: 25,
          views: 456,
          createdAt: '2024-03-18'
        },
        {
          id: 22,
          title: 'Muestra de mejores prácticas',
          author: 'UsuarioExperto',
          lastActivity: '2024-03-18',
          replies: 32,
          views: 567,
          createdAt: '2024-03-17'
        },
        {
          id: 23,
          title: 'Ganadores del premio a la innovación',
          author: 'Administrador',
          lastActivity: '2024-03-17',
          replies: 15,
          views: 789,
          createdAt: '2024-03-16'
        },
        {
          id: 24,
          title: 'Historias de éxito de usuarios',
          author: 'Moderador',
          lastActivity: '2024-03-16',
          replies: 28,
          views: 432,
          createdAt: '2024-03-15'
        },
        {
          id: 25,
          title: 'Ganadores de la muestra mensual',
          author: 'Administrador',
          lastActivity: '2024-03-15',
          replies: 22,
          views: 345,
          createdAt: '2024-03-14'
        },
        {
          id: 26,
          title: 'Destacado de la comunidad',
          author: 'Moderador',
          lastActivity: '2024-03-14',
          replies: 19,
          views: 234,
          createdAt: '2024-03-13'
        }
      ]
    }
  ];

  isNewThread(thread: Thread): boolean {
    const threadDate = new Date(thread.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - threadDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // Consider threads less than 7 days old as new
  }

  isHotThread(thread: Thread): boolean {
    return thread.replies >= 20 || thread.views >= 500; // Consider threads with 20+ replies or 500+ views as hot
  }

  toggleCategory(categoryId: number): void {
    const category = this.categories.find(c => c.id === categoryId);
    if (category) {
      category.isExpanded = !category.isExpanded;
    }
  }

  createNewThread(categoryId: number): void {
    if (this.modal) {
      this.modal.open();
      this.modal.createThread.subscribe((threadData: {title: string, content: string}) => {
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
          const newThread: Thread = {
            id: Math.max(...category.threads.map(t => t.id)) + 1,
            title: threadData.title,
            author: 'Usuario Actual', // This should come from your auth service
            lastActivity: new Date().toISOString(),
            replies: 0,
            views: 0,
            createdAt: new Date().toISOString()
          };
          category.threads.unshift(newThread);
        }
      });
    }
  }

  generatePlaceholderComments(thread: Thread): Comment[] {
    const comments: Comment[] = [];
    const authors = ['Usuario123', 'Moderador', 'Admin', 'MiembroActivo', 'NuevoUsuario'];
    const commentTemplates = [
      'Me parece muy interesante este tema. {content}',
      'Gracias por compartir esta información. {content}',
      'Tengo una pregunta sobre {content}',
      'Estoy de acuerdo con lo que mencionas sobre {content}',
      'Podrías explicar más sobre {content}?'
    ];

    const numComments = Math.floor(Math.random() * 5) + 3; // 3-7 comments

    for (let i = 0; i < numComments; i++) {
      const template = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
      const content = template.replace('{content}', thread.title.toLowerCase());

      comments.push({
        id: i + 1,
        author: authors[Math.floor(Math.random() * authors.length)],
        content: content,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // Random date within last week
      });
    }

    return comments;
  }

  openThreadDetails(thread: Thread): void {
    const threadDetails: ThreadDetails = {
      ...thread,
      content: `Este es el contenido del tema "${thread.title}". Aquí se muestra el mensaje original del autor.`,
      comments: this.generatePlaceholderComments(thread)
    };

    this.threadModal.thread = threadDetails;
    this.threadModal.open();
  }

  ngAfterViewInit() {
    // Set up the comment subscription once when the component is initialized
    if (this.threadModal) {
      this.commentSubscription = this.threadModal.addNewComment.subscribe((comment: Comment) => {
        if (this.threadModal.thread) {
          this.threadModal.thread.comments.push(comment);
          this.threadModal.thread.replies++;
          this.threadModal.thread.lastActivity = new Date().toISOString();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.commentSubscription) {
      this.commentSubscription.unsubscribe();
    }
  }
}
