import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-photo-grid',
  template: '<ng-content />',
  styleUrl: './photo-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGrid {}
