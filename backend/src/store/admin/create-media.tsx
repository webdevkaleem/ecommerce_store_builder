import { create } from "zustand";

interface CreateMedia {
  key: string;
  images: { key: string; url: string }[];
  setName: (key: string) => void;
  pushImages: (image: { key: string; url: string }[]) => void;
  resetMedia: () => void;
}

const initialState = {
  key: "",
  images: [],
};

export const useCreateMediaStore = create<CreateMedia>()((set) => ({
  ...initialState,
  setName: (key) =>
    set(() => {
      return { key };
    }),
  pushImages: (images) =>
    set((before) => {
      return { images: before.images.concat(images) };
    }),
  resetMedia: () => set(() => ({ ...initialState })),
}));
