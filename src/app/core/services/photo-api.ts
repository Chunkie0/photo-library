import { Injectable } from '@angular/core';
import { Observable, defer, map, timer } from 'rxjs';
import { Photo } from '../models/photo';

export const MIN_RESPONSE_DELAY_MS = 200;
export const MAX_RESPONSE_DELAY_MS = 300;

const IMAGE_HOST = 'https://picsum.photos';
const MAX_SEED = 999_999_999;

const THUMBNAIL_SIZE = '400/600';
const FULL_SIZE = '1200/800';

@Injectable({ providedIn: 'root' })
export class PhotoApi {
  getRandomPhotos(count: number): Observable<Photo[]> {
    return defer(() =>
      timer(randomInt(MIN_RESPONSE_DELAY_MS, MAX_RESPONSE_DELAY_MS)).pipe(
        map(() => createRandomPhotos(count)),
      ),
    );
  }
}

function createRandomPhotos(count: number): Photo[] {
  const ids = new Set<string>();

  while (ids.size < count) {
    ids.add(String(randomInt(1, MAX_SEED)));
  }

  return Array.from(ids, createPhoto);
}

function createPhoto(id: string): Photo {
  return {
    id,
    thumbnailUrl: `${IMAGE_HOST}/seed/${id}/${THUMBNAIL_SIZE}`,
    fullUrl: `${IMAGE_HOST}/seed/${id}/${FULL_SIZE}`,
  };
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
