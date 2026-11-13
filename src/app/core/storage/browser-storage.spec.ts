import { TestBed } from '@angular/core/testing';
import { BROWSER_STORAGE } from './browser-storage';
import { MemoryStorage } from './memory-storage';

describe('BROWSER_STORAGE', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides the local storage of the browser', () => {
    expect(TestBed.inject(BROWSER_STORAGE)).toBe(localStorage);
  });

  it('falls back to an in-memory storage when the browser blocks storage access', () => {
    vi.spyOn(globalThis, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('Access is denied', 'SecurityError');
    });

    const storage = TestBed.inject(BROWSER_STORAGE);
    storage.setItem('key', 'value');

    expect(storage).toBeInstanceOf(MemoryStorage);
    expect(storage.getItem('key')).toBe('value');
  });
});
