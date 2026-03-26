import { createContext } from 'react';
import type { Category } from './categoryTypes';

export interface CategoryContextType {
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
}

export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);
