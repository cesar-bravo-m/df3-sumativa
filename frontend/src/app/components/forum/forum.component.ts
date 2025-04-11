import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

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

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, UserAvatarComponent]
})
export class ForumComponent {
  currentPage: number = 1;
  totalPages: number = 5;
  threadsPerPage: number = 10;

  categories: Category[] = [
    {
      id: 1,
      name: 'Discusión General',
      description: 'Discusiones abiertas sobre cualquier tema',
      icon: 'chat',
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
      name: 'Soporte Técnico',
      description: 'Obtén ayuda con problemas técnicos',
      icon: 'support',
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
      name: 'Solicitudes de Funciones',
      description: 'Sugiere y discute nuevas funciones',
      icon: 'lightbulb',
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
      name: 'Anuncios',
      description: 'Actualizaciones y noticias importantes',
      icon: 'megaphone',
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
      name: 'Muestra',
      description: 'Comparte tu trabajo y logros',
      icon: 'trophy',
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
    // This would typically navigate to a new thread creation page
    console.log(`Creando nuevo tema en categoría ${categoryId}`);
    // Prevent the category from collapsing when clicking the button
    event?.stopPropagation();
  }
}
