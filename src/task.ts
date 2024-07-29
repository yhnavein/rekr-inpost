import type { CategoryListElement, RawCategory } from './types';

/**
 * Method for retrieving categories data from an external source
 * using a customizable loader function and then transforming it into
 * a structure expected by the frontend.
 * @param loader Function responsible for receiving the data from an external source
 * @returns Promise containing the category tree structure or an empty array
 */
export const loadCategoryTree = async (
  loader: () => Promise<RawCategory[]>
): Promise<CategoryListElement[]> => {
  const res = await loader();

  return getCategoryTree(res);
};

/**
 * Method for transforming a backend categories structure into a new one that
 * has business rules applied (like custom ordering and showing on home page).
 * @param categories Raw categories data from the backend
 * @returns Transformed category tree structure
 */
export const getCategoryTree = (categories: RawCategory[]) => {
  if (!categories) {
    return [];
  }

  // If a title at the root level contains a hash, it should be shown on the home page
  const toShowOnHome = categories
    .filter((c) => c.Title?.includes('#'))
    .map((c) => c.id);

  const result = processCategories(categories);

  return applyBusinessRules(result, toShowOnHome);
};

/**
 * Function that adjusts the category tree to match given business rules:
 * - If there are <= 5 categories, all of them should be shown on the home page
 * - If there are more than 5 categories, check if there are any categories
 *   with a hash in the title and only show those on the home page
 * - If there are no categories with a hash in the title, show the first 3 categories
 *   on the home page
 **/
function applyBusinessRules(
  categories: CategoryListElement[],
  toShowOnHome: number[]
): CategoryListElement[] {
  const maxCategoriesToHightlightAll = 5;
  const highlightFirstXElements = 3;

  if (categories.length <= maxCategoriesToHightlightAll) {
    return categories.map((x) => ({ ...x, showOnHome: true }));
  }

  if (toShowOnHome.length > 0) {
    return categories.map((x) => ({
      ...x,
      showOnHome: toShowOnHome.includes(x.id),
    }));
  }

  return categories.map((x, index) => ({
    ...x,
    showOnHome: index < highlightFirstXElements,
  }));
}

/** A recursive function that processes categories and their children */
function processCategories(categories: RawCategory[]): CategoryListElement[] {
  const result = categories.map<CategoryListElement>((c1) => {
    const order = getOrder(c1.Title, c1.id);
    const children = processCategories(c1.children ?? []);

    return {
      id: c1.id,
      image: c1.MetaTagDescription,
      name: c1.name,
      order,
      children,
      showOnHome: false,
    };
  });
  result.sort((a, b) => a.order - b.order);

  return result;
}

/** Extracts order by parsing `Title` and falling back to `id` */
function getOrder(title?: string, id?: number): number {
  const order = Number.parseInt(title, 10);
  return order || id;
}
