import { TestBed } from '@angular/core/testing';
import { Photo } from '../models/photo';
import { MAX_RESPONSE_DELAY_MS, MIN_RESPONSE_DELAY_MS, PhotoApi } from './photo-api';

interface PendingRequest {
  photos: Photo[] | undefined;
  completed: boolean;
}

describe('PhotoApi', () => {
  let api: PhotoApi;

  beforeEach(() => {
    vi.useFakeTimers();
    api = TestBed.inject(PhotoApi);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function request(count: number): PendingRequest {
    const pending: PendingRequest = { photos: undefined, completed: false };

    api.getRandomPhotos(count).subscribe({
      next: (photos) => (pending.photos = photos),
      complete: () => (pending.completed = true),
    });

    return pending;
  }

  it('responds with the requested number of photos and completes', () => {
    const pending = request(12);

    vi.advanceTimersByTime(MAX_RESPONSE_DELAY_MS);

    expect(pending.photos).toHaveLength(12);
    expect(pending.completed).toBe(true);
  });

  it('gives every photo a unique id', () => {
    const pending = request(50);

    vi.advanceTimersByTime(MAX_RESPONSE_DELAY_MS);

    const ids = pending.photos?.map((photo) => photo.id);
    expect(new Set(ids).size).toBe(50);
  });

  it('builds seeded picsum urls so a photo always resolves to the same image', () => {
    const pending = request(3);

    vi.advanceTimersByTime(MAX_RESPONSE_DELAY_MS);

    expect(pending.photos).toHaveLength(3);
    for (const photo of pending.photos ?? []) {
      expect(photo.id).toMatch(/^[1-9]\d*$/);
      expect(photo.thumbnailUrl).toBe(`https://picsum.photos/seed/${photo.id}/400/600`);
      expect(photo.fullUrl).toBe(`https://picsum.photos/seed/${photo.id}/1200/800`);
    }
  });

  it('returns different photos on every request', () => {
    const first = request(10);
    const second = request(10);

    vi.advanceTimersByTime(MAX_RESPONSE_DELAY_MS);

    expect(first.photos).toHaveLength(10);
    expect(first.photos).not.toEqual(second.photos);
  });

  it('never responds before the minimum delay', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0);
    const pending = request(1);

    vi.advanceTimersByTime(MIN_RESPONSE_DELAY_MS - 1);
    expect(pending.photos).toBeUndefined();

    vi.advanceTimersByTime(1);
    expect(pending.photos).toHaveLength(1);
  });

  it('never responds after the maximum delay', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.999999);
    const pending = request(1);

    vi.advanceTimersByTime(MAX_RESPONSE_DELAY_MS - 1);
    expect(pending.photos).toBeUndefined();

    vi.advanceTimersByTime(1);
    expect(pending.photos).toHaveLength(1);
  });

  it('does not start the request until subscribed', () => {
    api.getRandomPhotos(1);

    expect(vi.getTimerCount()).toBe(0);
  });
});
