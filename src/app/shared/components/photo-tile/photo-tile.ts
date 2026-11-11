import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Photo } from '../../../core/models/photo';

@Component({
  selector: 'button[appPhotoTile], a[appPhotoTile]',
  imports: [MatIcon],
  templateUrl: './photo-tile.html',
  styleUrl: './photo-tile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoTile {
  readonly photo = input.required<Photo>({ alias: 'appPhotoTile' });

  readonly favorite = input(false, { transform: booleanAttribute });

  readonly favoriteHint = input(false, { transform: booleanAttribute });
}
