import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { provideAppIcons } from '../../core/icons/app-icons';
import { Photo } from '../../core/models/photo';
import { FavoritesStore } from '../../core/services/favorites-store';
import { PhotoApi } from '../../core/services/photo-api';
import { BROWSER_STORAGE } from '../../core/storage/browser-storage';
import { FakeIntersectionObserver } from '../../testing/fake-intersection-observer';
import { MemoryStorage } from '../../testing/memory-storage';
import { createPhotos } from '../../testing/photo-fixtures';
import { PhotosPage } from './photos-page';

describe('PhotosPage', () => {
  let fixture: ComponentFixture<PhotosPage>;
  let element: HTMLElement;
  let favorites: FavoritesStore;
  let responses: Subject<Photo[]>[];

  function tiles(): HTMLButtonElement[] {
    return Array.from(element.querySelectorAll<HTMLButtonElement>('button[type="button"]'));
  }

  function loader(): HTMLElement | null {
    return element.querySelector('app-loader');
  }

  async function scrollToEnd(): Promise<void> {
    FakeIntersectionObserver.active[0].trigger(true);
    await fixture.whenStable();
  }

  async function respond(photos: Photo[]): Promise<void> {
    const response = responses[responses.length - 1];
    response.next(photos);
    response.complete();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    FakeIntersectionObserver.reset();
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    responses = [];

    const api: Pick<PhotoApi, 'getRandomPhotos'> = {
      getRandomPhotos: () => {
        const response = new Subject<Photo[]>();
        responses.push(response);

        return response.asObservable();
      },
    };

    TestBed.configureTestingModule({
      providers: [
        provideAppIcons(),
        { provide: PhotoApi, useValue: api },
        { provide: BROWSER_STORAGE, useValue: new MemoryStorage() },
      ],
    });

    favorites = TestBed.inject(FavoritesStore);
    fixture = TestBed.createComponent(PhotosPage);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('has a heading explaining what clicking a photo does', () => {
    expect(element.querySelector('h1')?.textContent).toBe('Photos');
    expect(element.textContent).toContain('Click a photo to add it to your favorites.');
  });

  it('requests the first photos as soon as the end of the (empty) list is visible', async () => {
    expect(responses).toHaveLength(0);

    await scrollToEnd();

    expect(responses).toHaveLength(1);
  });

  it('shows a loader while photos are loading', async () => {
    expect(loader()).toBeNull();

    await scrollToEnd();
    expect(loader()?.textContent).toContain('Loading more photos…');

    await respond(createPhotos(3));
    expect(loader()).toBeNull();
  });

  it('renders the loaded photos', async () => {
    const photos = createPhotos(3);

    await scrollToEnd();
    await respond(photos);

    expect(tiles()).toHaveLength(3);
    expect(tiles().map((tile) => tile.querySelector('img')?.getAttribute('src'))).toEqual(
      photos.map((photo) => photo.thumbnailUrl),
    );
  });

  it('loads more photos every time the user scrolls to the end', async () => {
    await scrollToEnd();
    await respond(createPhotos(3, 'a'));
    await scrollToEnd();
    await respond(createPhotos(3, 'b'));
    await scrollToEnd();
    await respond(createPhotos(3, 'c'));

    expect(responses).toHaveLength(3);
    expect(tiles()).toHaveLength(9);
  });

  it('does not request another page while one is loading', async () => {
    await scrollToEnd();

    expect(FakeIntersectionObserver.active).toHaveLength(0);
    expect(responses).toHaveLength(1);
  });

  it('adds a photo to the favorites when it is clicked', async () => {
    const photos = createPhotos(3);
    await scrollToEnd();
    await respond(photos);

    tiles()[1].click();
    await fixture.whenStable();

    expect(favorites.photos()).toEqual([photos[1]]);
  });

  it('marks favorite photos', async () => {
    await scrollToEnd();
    await respond(createPhotos(2));

    tiles()[0].click();
    await fixture.whenStable();

    const [favorite, other] = tiles();
    expect(favorite.getAttribute('aria-pressed')).toBe('true');
    expect(favorite.querySelector('.photo-tile-badge-favorite')).not.toBeNull();
    expect(other.getAttribute('aria-pressed')).toBe('false');
    expect(other.querySelector('.photo-tile-badge-favorite')).toBeNull();
  });

  it('removes a favorite photo when it is clicked again', async () => {
    await scrollToEnd();
    await respond(createPhotos(1));

    tiles()[0].click();
    await fixture.whenStable();
    tiles()[0].click();
    await fixture.whenStable();

    expect(favorites.photos()).toEqual([]);
    expect(tiles()[0].getAttribute('aria-pressed')).toBe('false');
  });

  it('gives every photo an accessible name', async () => {
    await scrollToEnd();
    await respond(createPhotos(1));

    expect(tiles()[0].getAttribute('aria-label')).toBe('Favorite photo 1');
  });
});
