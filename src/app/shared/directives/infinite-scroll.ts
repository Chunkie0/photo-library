import {
  Directive,
  ElementRef,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScroll {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly disabled = input(false, {
    alias: 'appInfiniteScrollDisabled',
    transform: booleanAttribute,
  });

  readonly margin = input('0px', { alias: 'appInfiniteScrollMargin' });

  readonly scrolled = output<void>();

  constructor() {
    effect((onCleanup) => {
      if (this.disabled()) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.scrolled.emit();
          }
        },
        { rootMargin: this.margin() },
      );

      observer.observe(this.element.nativeElement);
      onCleanup(() => observer.disconnect());
    });
  }
}
