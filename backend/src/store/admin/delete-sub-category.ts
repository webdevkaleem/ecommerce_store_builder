import { create } from "zustand";

interface DeleteSubCategory {
  many: boolean;
  subCategories: number[];
  setSubCategories: (subCategories: number[]) => void;
  resetSubCategories: () => void;
}

export const useDeleteSubCategoryStore = create<DeleteSubCategory>()((set) => ({
  many: false,
  subCategories: [],
  setSubCategories: (subCategories) =>
    set(() => {
      // If there is more than one category, then set the many state to true
      if (subCategories.length > 1)
        return {
          subCategories,
          many: true,
        };

      return { subCategories, many: false };
    }),
  resetSubCategories: () => set(() => ({ subCategories: [] })),
}));
