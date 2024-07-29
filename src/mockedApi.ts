import { INPUT } from './input';
import type { RawCategory } from './types';

export const getMockCategories = async (): Promise<{
  data: RawCategory[];
}> => ({
  data: INPUT,
});
