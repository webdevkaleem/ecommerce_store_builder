import { create } from "zustand";

type ImageType = {
  key: string;
  url: string;
  label: string;
};

interface CreateMedia {
  key: string;
  images: ImageType[];
  setName: (key: string) => void;
  pushImages: (images: ImageType[]) => void;
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
    set((og) => {
      return { images: og.images.concat(images) };
    }),
  resetMedia: () => set(() => ({ ...initialState })),
}));
