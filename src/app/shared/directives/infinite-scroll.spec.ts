import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FakeIntersectionObserver } from '../../testing/fake-intersection-observer';
import { InfiniteScroll } from './infinite-scroll';

@Component({
  imports: [InfiniteScroll],
  template: `
    <div
      class="sentinel"
      appInfiniteScroll
      [appInfiniteScrollDisabled]="disabled()"
      [appInfiniteScrollMargin]="margin()"
      (scrolled)="onScrolled()"
    ></div>
  `,
})
class Host {
  readonly disabled = signal(false);
  readonly margin = signal('0px 0px 100px 0px');
  readonly onScrolled = vi.fn();
}

describe('InfiniteScroll', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  function activeObserver(): FakeIntersectionObserver | undefined {
    expect(FakeIntersectionObserver.active.length).toBeLessThanOrEqual(1);

    return FakeIntersectionObserver.active[0];
  }

  beforeEach(async () => {
    FakeIntersectionObserver.reset();
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);

    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('observes its host element with the configured margin', () => {
    const sentinel = (fixture.nativeElement as HTMLElement).querySelector('.sentinel');

    expect(activeObserver()?.targets).toEqual(new Set([sentinel]));
    expect(activeObserver()?.rootMargin).toBe('0px 0px 100px 0px');
  });

  it('emits when the sentinel enters the viewport', () => {
    activeObserver()?.trigger(true);

    expect(host.onScrolled).toHaveBeenCalledTimes(1);
  });

  it('does not emit when the sentinel leaves the viewport', () => {
    activeObserver()?.trigger(false);

    expect(host.onScrolled).not.toHaveBeenCalled();
  });

  it('stops observing while disabled', async () => {
    host.disabled.set(true);
    await fixture.whenStable();

    expect(activeObserver()).toBeUndefined();
  });

  it('re-evaluates the sentinel when enabled again, to keep filling a tall viewport', async () => {
    const initialObserver = activeObserver();

    host.disabled.set(true);
    await fixture.whenStable();
    host.disabled.set(false);
    await fixture.whenStable();

    const newObserver = activeObserver();
    expect(newObserver).toBeDefined();
    expect(newObserver).not.toBe(initialObserver);

    newObserver?.trigger(true);
    expect(host.onScrolled).toHaveBeenCalledTimes(1);
  });

  it('applies margin changes', async () => {
    host.margin.set('0px 0px 800px 0px');
    await fixture.whenStable();

    expect(activeObserver()?.rootMargin).toBe('0px 0px 800px 0px');
  });

  it('stops observing when destroyed', () => {
    fixture.destroy();

    expect(activeObserver()).toBeUndefined();
  });
});
