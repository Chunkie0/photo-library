import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { createPhotos } from '../../testing/photo-fixtures';
import { Photo } from '../models/photo';
import { PhotoApi } from './photo-api';
import { PHOTOS_PER_PAGE, PhotoStream } from './photo-stream';

describe('PhotoStream', () => {
  let stream: PhotoStream;
  let responses: Subject<Photo[]>[];
  let getRandomPhotos: ReturnType<typeof vi.fn>;

  function respond(photos: Photo[]): void {
    const response = responses[responses.length - 1];
    response.next(photos);
    response.complete();
  }

  beforeEach(() => {
    responses = [];
    getRandomPhotos = vi.fn(() => {
      const response = new Subject<Photo[]>();
      responses.push(response);

      return response.asObservable();
    });

    TestBed.configureTestingModule({
      providers: [{ provide: PhotoApi, useValue: { getRandomPhotos } }],
    });
    stream = TestBed.inject(PhotoStream);
  });

  it('starts empty and idle, without requesting anything', () => {
    expect(stream.photos()).toEqual([]);
    expect(stream.loading()).toBe(false);
    expect(getRandomPhotos).not.toHaveBeenCalled();
  });

  it('requests one page of photos and reports that it is loading', () => {
    stream.loadMore();

    expect(getRandomPhotos).toHaveBeenCalledTimes(1);
    expect(getRandomPhotos).toHaveBeenCalledWith(PHOTOS_PER_PAGE);
    expect(stream.loading()).toBe(true);
    expect(stream.photos()).toEqual([]);
  });

  it('exposes the photos once the page has loaded', () => {
    const page = createPhotos(3);

    stream.loadMore();
    respond(page);

    expect(stream.photos()).toEqual(page);
    expect(stream.loading()).toBe(false);
  });

  it('appends following pages after the photos that are already listed', () => {
    const firstPage = createPhotos(2, 'a');
    const secondPage = createPhotos(2, 'b');

    stream.loadMore();
    respond(firstPage);
    stream.loadMore();
    respond(secondPage);

    expect(getRandomPhotos).toHaveBeenCalledTimes(2);
    expect(stream.photos()).toEqual([...firstPage, ...secondPage]);
  });

  it('ignores calls made while a page is still loading', () => {
    stream.loadMore();
    stream.loadMore();
    stream.loadMore();

    expect(getRandomPhotos).toHaveBeenCalledTimes(1);
  });

  it('skips photos that are already listed', () => {
    const [first, second, third] = createPhotos(3);

    stream.loadMore();
    respond([first, second]);
    stream.loadMore();
    respond([second, third]);

    expect(stream.photos()).toEqual([first, second, third]);
  });
});
