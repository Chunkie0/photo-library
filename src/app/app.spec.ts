import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { App } from './app';
import { appConfig } from './app.config';
import { FavoritesStore } from './core/services/favorites-store';
import { BROWSER_STORAGE } from './core/storage/browser-storage';
import { FakeIntersectionObserver } from './testing/fake-intersection-observer';
import { MemoryStorage } from './core/storage/memory-storage';
import { createPhoto } from './testing/photo-fixtures';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let element: HTMLElement;
  let router: Router;

  async function navigate(url: string): Promise<void> {
    await router.navigateByUrl(url);
    await fixture.whenStable();
  }

  beforeEach(async () => {
    FakeIntersectionObserver.reset();
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);

    TestBed.configureTestingModule({
      providers: [
        ...appConfig.providers,
        { provide: BROWSER_STORAGE, useValue: new MemoryStorage() },
      ],
    });

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(App);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the photo stream at /', async () => {
    await navigate('/');

    expect(element.querySelector('app-photos-page')).not.toBeNull();
    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('shows the favorites at /favorites', async () => {
    await navigate('/favorites');

    expect(element.querySelector('app-favorites-page')).not.toBeNull();
  });

  it('shows a single photo at /photos/:id', async () => {
    TestBed.inject(FavoritesStore).add(createPhoto('42'));

    await navigate('/photos/42');

    expect(element.querySelector('app-photo-detail-page h1')?.textContent).toBe('Photo 42');
  });

  it('redirects unknown urls to the photo stream', async () => {
    await navigate('/does/not/exist');

    expect(router.url).toBe('/');
    expect(element.querySelector('app-photos-page')).not.toBeNull();
  });

  it.each(['/', '/favorites', '/photos/42'])('keeps the same header on %s', async (url) => {
    await navigate(url);

    const links = Array.from(element.querySelectorAll('app-header a'), (link) =>
      link.textContent.trim(),
    );
    expect(links).toEqual(['Photos', 'Favorites']);
    expect(element.querySelector('main')).not.toBeNull();
  });

  it('sets the document title for each page', async () => {
    await navigate('/favorites');

    expect(document.title).toBe('Favorites · Photo Library');
  });
});
