export interface Photo {
  readonly id: string;
  readonly thumbnailUrl: string;
  readonly fullUrl: string;
}

export function isPhoto(value: unknown): value is Photo {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate['id'] === 'string' &&
    candidate['id'].length > 0 &&
    typeof candidate['thumbnailUrl'] === 'string' &&
    typeof candidate['fullUrl'] === 'string'
  );
}
