import { InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('BROWSER_STORAGE', {
  providedIn: 'root',
  factory: () => localStorage,
});
