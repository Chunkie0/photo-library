import { TestBed } from '@angular/core/testing';
import { MemoryStorage } from '../../testing/memory-storage';
import { createPhoto } from '../../testing/photo-fixtures';
import { BROWSER_STORAGE } from '../storage/browser-storage';
import { FAVORITES_STORAGE_KEY, FavoritesStore } from './favorites-store';

describe('FavoritesStore', () => {
  const first = createPhoto('1');
  const second = createPhoto('2');

  let storage: MemoryStorage;

  function createStore(): FavoritesStore {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: BROWSER_STORAGE, useValue: storage }],
    });

    return TestBed.inject(FavoritesStore);
  }

  function storedFavorites(): unknown {
    return JSON.parse(storage.getItem(FAVORITES_STORAGE_KEY) ?? 'null');
  }

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  it('starts empty when nothing is stored', () => {
    const store = createStore();

    expect(store.photos()).toEqual([]);
    expect(store.count()).toBe(0);
  });

  it('adds photos in the order they were favorited', () => {
    const store = createStore();

    store.add(first);
    store.add(second);

    expect(store.photos()).toEqual([first, second]);
    expect(store.count()).toBe(2);
  });

  it('does not add the same photo twice', () => {
    const store = createStore();

    store.add(first);
    store.add({ ...first });

    expect(store.photos()).toEqual([first]);
  });

  it('tells whether a photo is a favorite and returns it by id', () => {
    const store = createStore();

    store.add(first);

    expect(store.has('1')).toBe(true);
    expect(store.get('1')).toEqual(first);
    expect(store.has('2')).toBe(false);
    expect(store.get('2')).toBeUndefined();
  });

  it('removes a photo by id', () => {
    const store = createStore();
    store.add(first);
    store.add(second);

    store.remove('1');

    expect(store.photos()).toEqual([second]);
    expect(store.has('1')).toBe(false);
  });

  it('ignores removal of a photo that is not a favorite', () => {
    const store = createStore();
    store.add(first);
    const setItem = vi.spyOn(storage, 'setItem');

    store.remove('unknown');

    expect(store.photos()).toEqual([first]);
    expect(setItem).not.toHaveBeenCalled();
  });

  it('toggles a photo in and out of the favorites', () => {
    const store = createStore();

    store.toggle(first);
    expect(store.has('1')).toBe(true);

    store.toggle(first);
    expect(store.has('1')).toBe(false);
  });

  it('persists every change to storage', () => {
    const store = createStore();

    store.add(first);
    store.add(second);
    expect(storedFavorites()).toEqual([first, second]);

    store.remove('1');
    expect(storedFavorites()).toEqual([second]);
  });

  it('restores the favorites after a page reload', () => {
    const beforeReload = createStore();
    beforeReload.add(first);
    beforeReload.add(second);

    const afterReload = createStore();

    expect(afterReload).not.toBe(beforeReload);
    expect(afterReload.photos()).toEqual([first, second]);
  });

  it.each([
    ['invalid JSON', '{not json'],
    ['a non-array value', '{"id":"1"}'],
    ['null', 'null'],
  ])('starts empty when storage holds %s', (_description, stored) => {
    storage.setItem(FAVORITES_STORAGE_KEY, stored);

    expect(createStore().photos()).toEqual([]);
  });

  it('drops malformed and duplicated entries found in storage', () => {
    storage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify([first, { id: 7 }, null, 'photo', { ...first }, second]),
    );

    expect(createStore().photos()).toEqual([first, second]);
  });

  it('keeps working in memory when storage cannot be read', () => {
    vi.spyOn(storage, 'getItem').mockImplementation(() => {
      throw new Error('Storage is disabled');
    });
    const store = createStore();

    store.add(first);

    expect(store.photos()).toEqual([first]);
  });

  it('keeps working in memory when storage cannot be written', () => {
    vi.spyOn(storage, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    const store = createStore();

    store.add(first);

    expect(store.photos()).toEqual([first]);
  });
});
