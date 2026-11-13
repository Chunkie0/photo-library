import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideAppIcons } from '../../core/icons/app-icons';
import { FavoritesStore } from '../../core/services/favorites-store';
import { BROWSER_STORAGE } from '../../core/storage/browser-storage';
import { MemoryStorage } from '../../core/storage/memory-storage';
import { createPhoto } from '../../testing/photo-fixtures';
import { PhotoDetailPage } from './photo-detail-page';

@Component({ template: 'Favorites page' })
class FavoritesPageStub {}

describe('PhotoDetailPage', () => {
  const photo = createPhoto('42');
  const otherPhoto = createPhoto('7');

  let harness: RouterTestingHarness;
  let favorites: FavoritesStore;

  function page(): HTMLElement {
    return harness.routeNativeElement as HTMLElement;
  }

  function removeButton(): HTMLButtonElement | null {
    return page().querySelector<HTMLButtonElement>('button');
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideAppIcons(),
        provideRouter(
          [
            { path: 'photos/:id', component: PhotoDetailPage },
            { path: 'favorites', component: FavoritesPageStub },
          ],
          withComponentInputBinding(),
        ),
        { provide: BROWSER_STORAGE, useValue: new MemoryStorage() },
      ],
    });

    favorites = TestBed.inject(FavoritesStore);
    favorites.add(photo);
    favorites.add(otherPhoto);

    harness = await RouterTestingHarness.create();
  });

  describe('for a favorite photo', () => {
    beforeEach(async () => {
      await harness.navigateByUrl('/photos/42', PhotoDetailPage);
    });

    it('shows only that photo, in full size', () => {
      const images = page().querySelectorAll('img');

      expect(images).toHaveLength(1);
      expect(images[0].getAttribute('src')).toBe(photo.fullUrl);
      expect(images[0].getAttribute('alt')).toBe('Photo 42, shown full size');
    });

    it('names the photo in the heading', () => {
      expect(page().querySelector('h1')?.textContent).toBe('Photo 42');
    });

    it('has a "Remove from favorites" button', () => {
      expect(removeButton()?.textContent).toContain('Remove from favorites');
    });

    it('links back to the favorites', () => {
      const back = page().querySelector('a');

      expect(back?.textContent).toContain('Back to favorites');
      expect(back?.getAttribute('href')).toBe('/favorites');
    });

    it('removes the photo from the favorites and goes back to the list', async () => {
      removeButton()?.click();
      await harness.fixture.whenStable();

      expect(favorites.has('42')).toBe(false);
      expect(favorites.photos()).toEqual([otherPhoto]);
      expect(TestBed.inject(Router).url).toBe('/favorites');
      expect(page().textContent).toContain('Favorites page');
    });

    it('shows the other photo when the route parameter changes', async () => {
      await harness.navigateByUrl('/photos/7', PhotoDetailPage);

      expect(page().querySelector('img')?.getAttribute('src')).toBe(otherPhoto.fullUrl);
      expect(page().querySelector('h1')?.textContent).toBe('Photo 7');
    });
  });

  describe('for a photo that is not a favorite', () => {
    beforeEach(async () => {
      await harness.navigateByUrl('/photos/unknown', PhotoDetailPage);
    });

    it('explains that the photo could not be found', () => {
      expect(page().textContent).toContain('Photo not found');
      expect(page().querySelector('img')).toBeNull();
      expect(removeButton()).toBeNull();
    });

    it('links back to the favorites', () => {
      expect(page().querySelector('a')?.getAttribute('href')).toBe('/favorites');
    });
  });
});
