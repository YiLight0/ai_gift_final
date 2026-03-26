import { useState, type ReactNode } from 'react';
import { CategoryContext } from './categoryContextValue';
import type { Category } from './categoryTypes';

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('全部');

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}
