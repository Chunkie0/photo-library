import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Photo } from '../models/photo';
import { PhotoApi } from './photo-api';

export const PHOTOS_PER_PAGE = 12;

@Injectable({ providedIn: 'root' })
export class PhotoStream {
  private readonly api = inject(PhotoApi);

  private readonly photosState = signal<readonly Photo[]>([]);
  private readonly loadingState = signal(false);

  readonly photos = this.photosState.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  loadMore(): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);

    this.api
      .getRandomPhotos(PHOTOS_PER_PAGE)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe((page) => this.append(page));
  }

  private append(page: readonly Photo[]): void {
    this.photosState.update((photos) => {
      const knownIds = new Set(photos.map((photo) => photo.id));

      return [...photos, ...page.filter((photo) => !knownIds.has(photo.id))];
    });
  }
}
