import { create } from "zustand";

interface CreateMedia {
  name: string;
  setName: (name: string) => void;
  resetMedia: () => void;
}

const initialState = {
  name: "",
};

export const useCreateMediaStore = create<CreateMedia>()((set) => ({
  ...initialState,
  setName: (name) =>
    set(() => {
      return { name };
    }),
  resetMedia: () => set(() => ({ ...initialState })),
}));
