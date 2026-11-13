import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FavoritesStore } from '../../core/services/favorites-store';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-photo-detail-page',
  imports: [EmptyState, MatButton, MatIcon, RouterLink],
  templateUrl: './photo-detail-page.html',
  styleUrl: './photo-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDetailPage {
  private readonly favorites = inject(FavoritesStore);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  protected readonly photo = computed(() => this.favorites.get(this.id()));

  protected async remove(): Promise<void> {
    const id = this.id();

    await this.router.navigate(['/favorites']);

    this.favorites.remove(id);
  }
}
