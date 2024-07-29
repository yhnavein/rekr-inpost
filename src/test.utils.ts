import type { RawCategory } from './types';

/** Creates a sample category object for testing */
export function mockCategory(
  id = 123,
  title?: string,
  children: RawCategory[] = []
): RawCategory {
  const name = `Cat${id}`;
  const url = `https://example.com/${id}`;

  return {
    id,
    name,
    hasChildren: children.length > 0,
    url,
    children,
    Title: title ?? name,
    MetaTagDescription: name,
  };
}
