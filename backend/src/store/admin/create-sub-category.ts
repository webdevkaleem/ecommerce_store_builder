import { create } from "zustand";

interface CreateSubCategoryActions {
  setCategoryName: (categoryName: string | undefined) => void;
  setCategoryId: (categoryId: number | undefined) => void;
  toggleShow: () => void;
  resetCreateSubCategory: () => void;
}

interface CreateSubCategoryState {
  categoryName: string | undefined;
  categoryId: number | undefined;
  show: boolean;
}

const initialState: CreateSubCategoryState = {
  categoryId: undefined,
  categoryName: undefined,
  show: false,
};

export const useCreateSubCategoryStore = create<
  CreateSubCategoryState & CreateSubCategoryActions
>()((set, get) => ({
  ...initialState,
  setCategoryName: (categoryName) => set(() => ({ categoryName })),
  setCategoryId: (categoryId) => set(() => ({ categoryId })),
  toggleShow: () =>
    set(() => {
      const { show } = get();

      return { show: !show };
    }),
  resetCreateSubCategory: () => set(initialState),
}));
