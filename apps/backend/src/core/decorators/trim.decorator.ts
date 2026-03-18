import { Transform } from 'class-transformer';

export function Trim() {
  return Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((item) =>
        typeof item === 'string' ? item.trim() : item,
      );
    }
    return typeof value === 'string' ? value.trim() : value;
  });
}
