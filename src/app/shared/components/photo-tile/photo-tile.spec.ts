import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAppIcons } from '../../../core/icons/app-icons';
import { createPhoto } from '../../../testing/photo-fixtures';
import { PhotoTile } from './photo-tile';

@Component({
  imports: [PhotoTile],
  template: `
    <button
      type="button"
      [appPhotoTile]="photo"
      [favorite]="favorite()"
      [favoriteHint]="favoriteHint()"
      aria-label="Photo 42"
    ></button>
  `,
})
class Host {
  readonly photo = createPhoto('42');
  readonly favorite = signal(false);
  readonly favoriteHint = signal(false);
}

describe('PhotoTile', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  let tile: HTMLButtonElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideAppIcons()] });

    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();

    tile = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
  });

  it('shows the photo thumbnail, lazily loaded', () => {
    const image = tile.querySelector('img');

    expect(image?.getAttribute('src')).toBe(host.photo.thumbnailUrl);
    expect(image?.getAttribute('loading')).toBe('lazy');
  });

  it('leaves the accessible name to the host element', () => {
    expect(tile.querySelector('img')?.getAttribute('alt')).toBe('');
    expect(tile.getAttribute('aria-label')).toBe('Photo 42');
  });

  it('shows no badge by default', () => {
    expect(tile.querySelector('.photo-tile-badge')).toBeNull();
  });

  it('shows the favorite badge for a favorite photo', async () => {
    host.favorite.set(true);
    await fixture.whenStable();

    expect(tile.querySelector('.photo-tile-badge-favorite')).not.toBeNull();
    expect(tile.querySelector('.photo-tile-badge-hint')).toBeNull();
  });

  it('shows the hint badge for a photo that can be favorited', async () => {
    host.favoriteHint.set(true);
    await fixture.whenStable();

    expect(tile.querySelector('.photo-tile-badge-hint')).not.toBeNull();
    expect(tile.querySelector('.photo-tile-badge-favorite')).toBeNull();
  });

  it('replaces the hint with the favorite badge once the photo is a favorite', async () => {
    host.favoriteHint.set(true);
    host.favorite.set(true);
    await fixture.whenStable();

    expect(tile.querySelector('.photo-tile-badge-favorite')).not.toBeNull();
    expect(tile.querySelector('.photo-tile-badge-hint')).toBeNull();
  });
});
