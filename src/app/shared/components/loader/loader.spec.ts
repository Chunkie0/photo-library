import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Loader } from './loader';

describe('Loader', () => {
  let fixture: ComponentFixture<Loader>;
  let element: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Loader);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('shows a spinner', () => {
    expect(element.querySelector('mat-progress-spinner')).not.toBeNull();
  });

  it('is announced as a status with a default message', () => {
    expect(element.getAttribute('role')).toBe('status');
    expect(element.textContent).toContain('Loading…');
  });

  it('shows a custom message', async () => {
    fixture.componentRef.setInput('label', 'Loading more photos…');
    await fixture.whenStable();

    expect(element.textContent).toContain('Loading more photos…');
  });
});
