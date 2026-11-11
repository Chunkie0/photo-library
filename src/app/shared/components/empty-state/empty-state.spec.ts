import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state';

@Component({
  imports: [EmptyState],
  template: `
    <app-empty-state title="No favorites yet" message="Add some photos.">
      <a href="/">Browse photos</a>
    </app-empty-state>
  `,
})
class Host {}

describe('EmptyState', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  it('renders the title and the message', () => {
    expect(element.querySelector('h2')?.textContent).toBe('No favorites yet');
    expect(element.querySelector('p')?.textContent).toBe('Add some photos.');
  });

  it('projects the actions', () => {
    expect(element.querySelector('app-empty-state a')?.textContent).toBe('Browse photos');
  });
});
