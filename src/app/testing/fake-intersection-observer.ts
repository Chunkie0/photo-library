export class FakeIntersectionObserver implements IntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  static get active(): FakeIntersectionObserver[] {
    return FakeIntersectionObserver.instances.filter((observer) => observer.targets.size > 0);
  }

  static reset(): void {
    FakeIntersectionObserver.instances = [];
  }

  readonly root = null;
  readonly rootMargin: string;
  readonly scrollMargin = '';
  readonly thresholds: readonly number[] = [0];
  readonly targets = new Set<Element>();

  constructor(
    private readonly callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {},
  ) {
    this.rootMargin = options.rootMargin ?? '';
    FakeIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.targets.add(target);
  }

  unobserve(target: Element): void {
    this.targets.delete(target);
  }

  disconnect(): void {
    this.targets.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(isIntersecting: boolean): void {
    const entries = [...this.targets].map(
      (target) => ({ target, isIntersecting }) as IntersectionObserverEntry,
    );

    this.callback(entries, this);
  }
}
