import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAppIcons } from '../../core/icons/app-icons';
import { FavoritesStore } from '../../core/services/favorites-store';
import { BROWSER_STORAGE } from '../../core/storage/browser-storage';
import { MemoryStorage } from '../../core/storage/memory-storage';
import { createPhoto, createPhotos } from '../../testing/photo-fixtures';
import { FavoritesPage } from './favorites-page';

describe('FavoritesPage', () => {
  let fixture: ComponentFixture<FavoritesPage>;
  let element: HTMLElement;
  let favorites: FavoritesStore;

  function tiles(): HTMLAnchorElement[] {
    return Array.from(element.querySelectorAll<HTMLAnchorElement>('app-photo-grid a'));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideAppIcons(),
        provideRouter([]),
        { provide: BROWSER_STORAGE, useValue: new MemoryStorage() },
      ],
    });

    favorites = TestBed.inject(FavoritesStore);
    fixture = TestBed.createComponent(FavoritesPage);
    element = fixture.nativeElement as HTMLElement;
  });

  it('lists all the favorite photos, in the order they were added', async () => {
    const photos = createPhotos(4);
    photos.forEach((photo) => favorites.add(photo));
    await fixture.whenStable();

    expect(element.querySelector('h1')?.textContent).toBe('Favorites');
    expect(tiles().map((tile) => tile.querySelector('img')?.getAttribute('src'))).toEqual(
      photos.map((photo) => photo.thumbnailUrl),
    );
  });

  it('links every photo to its single photo page', async () => {
    favorites.add(createPhoto('42'));
    await fixture.whenStable();

    expect(tiles()[0].getAttribute('href')).toBe('/photos/42');
    expect(tiles()[0].getAttribute('aria-label')).toBe('Open photo 42');
  });

  it('does not show favorite badges, since every photo here is a favorite', async () => {
    favorites.add(createPhoto('42'));
    await fixture.whenStable();

    expect(element.querySelector('.photo-tile-badge')).toBeNull();
  });

  it.each([
    [1, '1 photo · Click a photo to open it.'],
    [3, '3 photos · Click a photo to open it.'],
  ])('tells how many photos there are (%i)', async (count, expected) => {
    createPhotos(count).forEach((photo) => favorites.add(photo));
    await fixture.whenStable();

    expect(element.querySelector('app-page-header p')?.textContent).toBe(expected);
  });

  it('reflects favorites removed while the page is displayed', async () => {
    createPhotos(2).forEach((photo) => favorites.add(photo));
    await fixture.whenStable();

    favorites.remove('1');
    await fixture.whenStable();

    expect(tiles()).toHaveLength(1);
    expect(tiles()[0].getAttribute('href')).toBe('/photos/2');
  });

  it('invites the user to browse photos when there are no favorites', async () => {
    await fixture.whenStable();

    expect(tiles()).toHaveLength(0);
    expect(element.querySelector('app-page-header p')).toBeNull();
    expect(element.textContent).toContain('No favorites yet');
    expect(element.querySelector('app-empty-state a')?.getAttribute('href')).toBe('/');
  });
});
