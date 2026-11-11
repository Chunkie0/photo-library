import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeader } from './page-header';

describe('PageHeader', () => {
  let fixture: ComponentFixture<PageHeader>;
  let element: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(PageHeader);
    fixture.componentRef.setInput('title', 'Photos');
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('renders the title as the main heading', () => {
    expect(element.querySelector('h1')?.textContent).toBe('Photos');
  });

  it('renders no subtitle unless one is given', () => {
    expect(element.querySelector('p')).toBeNull();
  });

  it('renders the subtitle', async () => {
    fixture.componentRef.setInput('subtitle', 'Click a photo.');
    await fixture.whenStable();

    expect(element.querySelector('p')?.textContent).toBe('Click a photo.');
  });
});
