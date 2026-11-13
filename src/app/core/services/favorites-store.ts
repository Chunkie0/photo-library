import { DOCUMENT, DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { Photo, isPhoto } from '../models/photo';
import { BROWSER_STORAGE } from '../storage/browser-storage';

export const FAVORITES_STORAGE_KEY = 'photo-library.favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly storage = inject(BROWSER_STORAGE);

  private readonly state = signal<readonly Photo[]>(this.restore());
  private readonly byId = computed(
    () => new Map(this.state().map((photo) => [photo.id, photo] as const)),
  );

  readonly photos = this.state.asReadonly();
  readonly count = computed(() => this.state().length);

  constructor() {
    const view = inject(DOCUMENT).defaultView;

    const onStorage = (event: StorageEvent): void => {
      if (event.key === FAVORITES_STORAGE_KEY || event.key === null) {
        this.state.set(this.restore());
      }
    };

    view?.addEventListener('storage', onStorage);
    inject(DestroyRef).onDestroy(() => view?.removeEventListener('storage', onStorage));
  }

  has(id: string): boolean {
    return this.byId().has(id);
  }

  get(id: string): Photo | undefined {
    return this.byId().get(id);
  }

  add(photo: Photo): void {
    if (this.has(photo.id)) {
      return;
    }

    this.commit([...this.state(), photo]);
  }

  remove(id: string): void {
    if (!this.has(id)) {
      return;
    }

    this.commit(this.state().filter((photo) => photo.id !== id));
  }

  toggle(photo: Photo): void {
    if (this.has(photo.id)) {
      this.remove(photo.id);
    } else {
      this.add(photo);
    }
  }

  private commit(photos: readonly Photo[]): void {
    this.state.set(photos);

    try {
      this.storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(photos));
    } catch {}
  }

  private restore(): readonly Photo[] {
    try {
      const stored: unknown = JSON.parse(this.storage.getItem(FAVORITES_STORAGE_KEY) ?? '[]');

      if (!Array.isArray(stored)) {
        return [];
      }

      const photos = new Map<string, Photo>();
      for (const item of stored) {
        if (isPhoto(item) && !photos.has(item.id)) {
          photos.set(item.id, {
            id: item.id,
            thumbnailUrl: item.thumbnailUrl,
            fullUrl: item.fullUrl,
          });
        }
      }

      return [...photos.values()];
    } catch {
      return [];
    }
  }
}
