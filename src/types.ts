/**
 * Category object as expected in the application
 */
export interface CategoryListElement {
  name: string;
  id: number;
  image: string;
  order: number;
  children: CategoryListElement[];
  showOnHome: boolean;
}

/**
 * Category object as it comes from the API
 */
export interface RawCategory {
  id: number;
  name: string;
  hasChildren: boolean;
  url: string;
  Title?: string;
  MetaTagDescription: string;
  children?: RawCategory[];
}
