import { InjectionToken } from '@angular/core';
import { MemoryStorage } from './memory-storage';

export const BROWSER_STORAGE = new InjectionToken<Storage>('BROWSER_STORAGE', {
  providedIn: 'root',
  factory: () => {
    try {
      return localStorage;
    } catch {
      return new MemoryStorage();
    }
  },
});
