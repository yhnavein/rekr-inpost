import test from 'ava';

import { mockCategory } from './test.utils';

// Tests just for achieving 100% test coverage
// I would question if they are absolutely crucial in a real-world scenario
// But it's a nice feeling to see a 100% coverage :D

test('mockCategory to create a correct test object', (t) => {
  const res = mockCategory(1);
  const expected = {
    MetaTagDescription: 'Cat1',
    Title: 'Cat1',
    children: [],
    hasChildren: false,
    id: 1,
    name: 'Cat1',
    url: 'https://example.com/1',
  };

  t.deepEqual(res, expected);
});

test('mockCategory to create correct a test object with a custom title and default id', (t) => {
  const res = mockCategory(undefined, 'CategoryTitle123');
  const expected = {
    MetaTagDescription: 'Cat123',
    Title: 'CategoryTitle123',
    children: [],
    hasChildren: false,
    id: 123,
    name: 'Cat123',
    url: 'https://example.com/123',
  };

  t.deepEqual(res, expected);
});
