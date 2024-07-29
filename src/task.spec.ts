import test from 'ava';

import { CORRECT } from './correctResult';
import { INPUT } from './input';
import { getMockCategories } from './mockedApi';
import { getCategoryTree, loadCategoryTree } from './task';
import { mockCategory } from './test.utils';

const simpleTestCases = [
  { input: [], expected: [] },
  { input: null, expected: [] },
  { input: undefined, expected: [] },
  {
    input: [
      {
        id: 1,
        name: 'Cat1',
        hasChildren: false,
        url: 'https://example.com/1',
        children: [],
        Title: '5 - CategoryTitle1',
        MetaTagDescription: 'CatDesc1',
      },
    ],
    expected: [
      {
        children: [],
        id: 1,
        image: 'CatDesc1',
        name: 'Cat1',
        order: 5, // because of the `Title` starting with a number
        showOnHome: true,
      },
    ],
  },
];

// Testing simple test cases

for (const { input, expected } of simpleTestCases) {
  test(`handling ${input} in getCategoryTree`, (t) => {
    const res = getCategoryTree(input);
    t.deepEqual(res, expected);
  });
}

test('handling nullable fields in getCategoryTree', (t) => {
  const res = getCategoryTree([
    {
      id: 123,
      name: 'Cat123',
      hasChildren: false,
      url: 'https://example.com/123',
      MetaTagDescription: 'CatDesc123',
    },
  ]);
  t.deepEqual(res, [
    {
      id: 123,
      image: 'CatDesc123',
      name: 'Cat123',
      order: 123,
      showOnHome: true,
      children: [],
    },
  ]);
});

// Testing the given test data

test('handling given test data in getCategoryTree', (t) => {
  const res = getCategoryTree(INPUT);
  t.deepEqual(res, CORRECT);
});

// Testing the business rules

test('just few elements should be all displayed on Home', (t) => {
  const catTree = getCategoryTree([
    mockCategory(1),
    mockCategory(2),
    mockCategory(3, '3#'),
    mockCategory(4, '4'),
    mockCategory(5, '5#'),
  ]);
  const res = catTree.map((x) => x.showOnHome);
  t.is(res.length, 5);
  // all items should have showOnHome set to true
  t.is(
    res.every((c) => c),
    true
  );
});

test('only elements 3 and 7 should be displayed on Home', (t) => {
  const catTree = getCategoryTree([
    mockCategory(7, '7#'),
    mockCategory(6, '6'), // not shown, because hash is required for this particular business rule
    mockCategory(5),
    mockCategory(4),
    mockCategory(3, '3#'),
    mockCategory(2),
    mockCategory(1),
  ]);

  const res = catTree.map((x) => x.showOnHome);

  t.deepEqual(res, [false, false, true, false, false, false, true]);
});

test('first 3 elements should be hightlighted', (t) => {
  const catTree = getCategoryTree([
    mockCategory(7),
    mockCategory(6),
    mockCategory(5),
    mockCategory(4),
    mockCategory(3),
    mockCategory(2),
    mockCategory(1),
  ]);

  const res = catTree.map((x) => x.showOnHome);

  t.deepEqual(res, [true, true, true, false, false, false, false]);
});

// Testing the loadCategoryTree and the loaders

test('loadCategoryTree to load data through a loader correctly', async (t) => {
  const res = await loadCategoryTree(() => Promise.resolve(INPUT));

  t.deepEqual(res, CORRECT);
});

// I have left the getMockCategories as is, because it looks like an `axios` interface.
// It's good to have it, because it can be replaced very easily with an actual axios code
// like this: `axios.get('https://example.com/categories').then((res) => res.data)`.
// And we are still open for using `fetch` if we want or need to (or other similar library).
test('loadCategoryTree to load data through a mockApi correctly', async (t) => {
  const loader = () => getMockCategories().then((res) => res.data);
  const res = await loadCategoryTree(loader);

  t.deepEqual(res, CORRECT);
});
