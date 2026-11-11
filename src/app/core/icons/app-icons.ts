import { EnvironmentProviders, inject, provideEnvironmentInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';

function icon(content: string, fill = 'none'): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill}" ` +
    `stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
    `${content}</svg>`
  );
}

const APP_ICONS = {
  'arrow-back': icon('<path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>'),
  grid: icon(
    '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>' +
      '<rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  ),
  heart: icon(`<path d="${HEART_PATH}"/>`),
  'heart-filled': icon(`<path d="${HEART_PATH}"/>`, 'currentColor'),
  'heart-off': icon(`<path d="${HEART_PATH}"/><path d="M4 3l16 18"/>`),
} as const;

export type AppIcon = keyof typeof APP_ICONS;

export function provideAppIcons(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const registry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    for (const [name, svg] of Object.entries(APP_ICONS)) {
      registry.addSvgIconLiteral(name, sanitizer.bypassSecurityTrustHtml(svg));
    }
  });
}
