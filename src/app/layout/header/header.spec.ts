import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideAppIcons } from '../../core/icons/app-icons';
import { Header } from './header';

@Component({ template: '' })
class BlankPage {}

@Component({
  imports: [Header],
  template: '<app-header />',
})
class Shell {}

describe('Header', () => {
  let harness: RouterTestingHarness;
  let fixture: ComponentFixture<Shell>;
  let element: HTMLElement;

  function link(label: string): HTMLAnchorElement {
    const links = Array.from(element.querySelectorAll('a'));
    const match = links.find((candidate) => candidate.textContent.trim() === label);

    if (!match) {
      throw new Error(`No "${label}" link in the header`);
    }

    return match;
  }

  function isHighlighted(label: string): boolean {
    return link(label).classList.contains('header-link-active');
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideAppIcons(),
        provideRouter([
          { path: '', pathMatch: 'full', component: BlankPage },
          { path: 'favorites', component: BlankPage },
          { path: 'photos/:id', component: BlankPage },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create('/');
    fixture = TestBed.createComponent(Shell);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  it('consists of exactly two buttons: Photos and Favorites', () => {
    const labels = Array.from(element.querySelectorAll('a'), (anchor) => anchor.textContent.trim());

    expect(labels).toEqual(['Photos', 'Favorites']);
  });

  it('links to the photo stream and to the favorites library', () => {
    expect(link('Photos').getAttribute('href')).toBe('/');
    expect(link('Favorites').getAttribute('href')).toBe('/favorites');
  });

  it('highlights Photos on the photo stream', () => {
    expect(isHighlighted('Photos')).toBe(true);
    expect(link('Photos').getAttribute('aria-current')).toBe('page');
    expect(isHighlighted('Favorites')).toBe(false);
    expect(link('Favorites').hasAttribute('aria-current')).toBe(false);
  });

  it('highlights Favorites on the favorites library', async () => {
    await harness.navigateByUrl('/favorites');

    expect(isHighlighted('Favorites')).toBe(true);
    expect(link('Favorites').getAttribute('aria-current')).toBe('page');
    expect(isHighlighted('Photos')).toBe(false);
  });

  it('highlights neither view on a single photo page', async () => {
    await harness.navigateByUrl('/photos/42');

    expect(isHighlighted('Photos')).toBe(false);
    expect(isHighlighted('Favorites')).toBe(false);
  });

  it('navigates when a button is clicked', async () => {
    link('Favorites').click();
    await harness.fixture.whenStable();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/favorites');
    expect(isHighlighted('Favorites')).toBe(true);
  });
});
