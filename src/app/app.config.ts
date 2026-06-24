import { ApplicationConfig, APP_INITIALIZER, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ChatService } from './core/services/signalr';

// ميثود لتشغيل الخدمة عند بدء التطبيق
export function initializeSignalR(signalrService: ChatService) {
  return () => {
    // بمجرد عمل الحقل، الـ Constructor الخاص بالخدمة سيعمل ويبدأ الاتصال
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    // ⬅️ أضف هذا الجزء لضمان عمل الخدمة فوراً
    {
      provide: APP_INITIALIZER,
      useFactory: initializeSignalR,
      deps: [ChatService],
      multi: true
    }
  ]
};