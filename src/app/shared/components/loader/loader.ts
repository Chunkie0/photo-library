import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  imports: [MatProgressSpinner],
  template: `
    <mat-progress-spinner
      class="loader-spinner"
      mode="determinate"
      value="25"
      diameter="40"
      strokeWidth="4"
      aria-hidden="true"
    />
    <p class="loader-label">{{ label() }}</p>
  `,
  styleUrl: './loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status' },
})
export class Loader {
  readonly label = input('Loading…');
}
