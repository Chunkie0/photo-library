import { isPhoto } from './photo';

describe('isPhoto', () => {
  it('accepts a well-formed photo', () => {
    expect(isPhoto({ id: '1', thumbnailUrl: 'thumb.jpg', fullUrl: 'full.jpg' })).toBe(true);
  });

  it.each([
    ['null', null],
    ['a primitive', 'photo'],
    ['an array', []],
    ['a missing id', { thumbnailUrl: 'thumb.jpg', fullUrl: 'full.jpg' }],
    ['an empty id', { id: '', thumbnailUrl: 'thumb.jpg', fullUrl: 'full.jpg' }],
    ['a numeric id', { id: 1, thumbnailUrl: 'thumb.jpg', fullUrl: 'full.jpg' }],
    ['a missing thumbnail', { id: '1', fullUrl: 'full.jpg' }],
    ['a missing full size url', { id: '1', thumbnailUrl: 'thumb.jpg' }],
  ])('rejects %s', (_description, value) => {
    expect(isPhoto(value)).toBe(false);
  });
});
