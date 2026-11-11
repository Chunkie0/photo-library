import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <h2 class="empty-state-title">{{ title() }}</h2>
    <p class="empty-state-message">{{ message() }}</p>
    <ng-content />
  `,
  styleUrl: './empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
}
