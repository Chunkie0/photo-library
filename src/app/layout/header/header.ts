import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppIcon } from '../../core/icons/app-icons';

interface NavigationLink {
  readonly label: string;
  readonly path: string;
  readonly icon: AppIcon;
}

@Component({
  selector: 'app-header',
  imports: [MatButton, MatIcon, MatToolbar, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly links: readonly NavigationLink[] = [
    { label: 'Photos', path: '/', icon: 'grid' },
    { label: 'Favorites', path: '/favorites', icon: 'heart' },
  ];
}
