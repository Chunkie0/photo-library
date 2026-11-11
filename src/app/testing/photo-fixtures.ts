import { Photo } from '../core/models/photo';

export function createPhoto(id: string): Photo {
  return {
    id,
    thumbnailUrl: `https://example.test/${id}/thumbnail.jpg`,
    fullUrl: `https://example.test/${id}/full.jpg`,
  };
}

export function createPhotos(count: number, prefix = ''): Photo[] {
  return Array.from({ length: count }, (_, index) => createPhoto(`${prefix}${index + 1}`));
}
