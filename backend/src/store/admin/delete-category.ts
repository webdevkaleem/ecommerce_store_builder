import { create } from "zustand";

interface DeleteCategory {
  many: boolean;
  categories: number[];
  setCategories: (categories: number[]) => void;
  resetCategories: () => void;
}

export const useDeleteCategoryStore = create<DeleteCategory>()((set) => ({
  many: false,
  categories: [],
  setCategories: (categories) =>
    set(() => {
      // If there is more than one category, then set the many state to true
      if (categories.length > 1)
        return {
          categories,
          many: true,
        };

      return { categories, many: false };
    }),
  resetCategories: () => set(() => ({ categories: [] })),
}));
