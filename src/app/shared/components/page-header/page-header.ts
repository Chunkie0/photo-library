import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <h1 class="page-header-title">{{ title() }}</h1>
    @if (subtitle(); as subtitle) {
      <p class="page-header-subtitle">{{ subtitle }}</p>
    }
  `,
  styleUrl: './page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}
