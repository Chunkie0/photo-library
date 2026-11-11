import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FavoritesStore } from '../../core/services/favorites-store';
import { PhotoStream } from '../../core/services/photo-stream';
import { Loader } from '../../shared/components/loader/loader';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { PhotoGrid } from '../../shared/components/photo-grid/photo-grid';
import { PhotoTile } from '../../shared/components/photo-tile/photo-tile';
import { InfiniteScroll } from '../../shared/directives/infinite-scroll';

@Component({
  selector: 'app-photos-page',
  imports: [InfiniteScroll, Loader, PageHeader, PhotoGrid, PhotoTile],
  templateUrl: './photos-page.html',
  styleUrl: './photos-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosPage {
  protected readonly stream = inject(PhotoStream);
  protected readonly favorites = inject(FavoritesStore);
}
