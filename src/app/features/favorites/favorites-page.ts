import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FavoritesStore } from '../../core/services/favorites-store';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { PhotoGrid } from '../../shared/components/photo-grid/photo-grid';
import { PhotoTile } from '../../shared/components/photo-tile/photo-tile';

@Component({
  selector: 'app-favorites-page',
  imports: [EmptyState, MatButton, PageHeader, PhotoGrid, PhotoTile, RouterLink],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPage {
  protected readonly favorites = inject(FavoritesStore);

  protected readonly subtitle = computed(() => {
    const count = this.favorites.count();

    if (count === 0) {
      return undefined;
    }

    return `${count} ${count === 1 ? 'photo' : 'photos'} · Click a photo to open it.`;
  });
}
