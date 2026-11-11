# Photo Library

An infinite stream of random photos, with a library of your favorites.
Built with Angular 22, Angular Material and SCSS.

| Route         | Page         | What it does                                                                         |
| ------------- | ------------ | ------------------------------------------------------------------------------------ |
| `/`           | Photos       | Endless, randomly generated photo stream. Clicking a photo adds it to the favorites. |
| `/favorites`  | Favorites    | All the favorite photos. Clicking a photo opens its single photo page.               |
| `/photos/:id` | Single photo | One favorite photo in full size, with a **Remove from favorites** button.            |

The header is shared by every page and highlights the view being displayed.

## Getting started

Requirements: [Node.js](https://nodejs.org) `^22.22.3`, `^24.15.0` or `>=26` (npm is included).

```bash
npm install
```

```bash
npm start
```

Then open <http://localhost:4200>. The application reloads when a source file changes.

## Scripts

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `npm start`       | Runs the development server on port 4200.         |
| `npm test`        | Runs the unit tests in watch mode (Vitest).       |
| `npm run test:ci` | Runs the unit tests once.                         |
| `npm run lint`    | Lints the TypeScript and the templates (ESLint).  |
| `npm run build`   | Builds the application for production in `dist/`. |
| `npm run format`  | Formats the sources with Prettier.                |

## How it works

### Photos and the emulated API

There is no backend. `PhotoApi` emulates one: each request resolves after a random
**200–300 ms** delay with a page of freshly generated photos. Images come from
[Lorem Picsum](https://picsum.photos) using _seeded_ URLs
(`https://picsum.photos/seed/{id}/400/600`): a seed always resolves to the same picture,
so a favorite photo still shows the same image after a reload, and every generated id is
guaranteed to have an image.

### Infinite scroll

Implemented from scratch, without any library, by the `appInfiniteScroll` directive
(`src/app/shared/directives/infinite-scroll.ts`). It watches a sentinel element placed after
the grid with the browser's `IntersectionObserver` and emits when the sentinel scrolls
into view. Observation is paused while a page is loading and restarted afterwards,
which re-checks the sentinel: on a tall screen, pages keep loading until the viewport is
filled. A loader is displayed while a page is loading.

### Favorites

`FavoritesStore` holds the favorites in a signal and mirrors every change to
`localStorage`, so the list survives a page refresh without any server. Stored data is
validated when it is read back, and the application keeps working in memory if storage is
unavailable.

On the Photos page a favorite photo is marked with a badge; clicking it again removes it
from the favorites. Photos can also be removed from their single photo page.

## Project structure

```
src/
├── styles.scss                 Global styles and the Angular Material theme
├── styles/_tokens.scss         Design tokens and mixins shared by all component styles
└── app/
    ├── app.ts                  Application shell: header + router outlet
    ├── app.config.ts           Application providers (router, icons)
    ├── app.routes.ts           Lazy loaded routes
    ├── core/                   Application-wide, UI-less building blocks
    │   ├── icons/              SVG icon set registered with MatIconRegistry
    │   ├── models/             Photo model
    │   ├── services/           PhotoApi, PhotoStream, FavoritesStore
    │   └── storage/            Injection token for the browser storage
    ├── layout/
    │   └── header/             Header with the two navigation buttons
    ├── shared/                 Reusable, presentational pieces
    │   ├── components/         PhotoTile, PhotoGrid, Loader, PageHeader, EmptyState
    │   └── directives/         InfiniteScroll
    ├── features/               One folder per page
    │   ├── photos/             /
    │   ├── favorites/          /favorites
    │   └── photo-detail/       /photos/:id
    └── testing/                Test helpers (fixtures, fakes)
```

## Technical choices

- **Standalone components and signals.** The application follows current Angular
  conventions: standalone components (the framework default, replacing `NgModule`s),
  signal-based state and inputs, built-in control flow, `OnPush` and zoneless change
  detection. Pages are lazy loaded with `loadComponent`.
- **Angular Material** provides the toolbar, buttons, icons and progress spinner. Its
  Material 3 theme is configured in `src/styles.scss` and adjusted per component through
  the official `*-overrides` mixins.
- **State lives in services, components stay thin.** `PhotoStream` keeps the loaded photos
  at the root level, so the stream is still there when coming back from another page.
- **Accessibility.** Photos are real buttons and links with accessible names, the active
  view is exposed with `aria-current`, focus is always visible, and the loader is
  announced as a status.
- **Testing.** Unit tests (Vitest) cover the services, the directive, every component and
  the routing. They sit next to the code they test, in `*.spec.ts` files.
