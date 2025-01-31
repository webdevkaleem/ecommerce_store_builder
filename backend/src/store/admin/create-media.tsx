import { create } from "zustand";

interface MediaType {
  key?: string;
  name?: string;
  url?: string;
  type?: string;
  size?: string;
  extension?: string;
}

interface MediaActions {
  setMedia: (image: MediaType) => void;
  setName: (name: string) => void;
  resetMedia: () => void;
}

const initialState: MediaType = {
  key: undefined,
  name: undefined,
  url: undefined,
  size: undefined,
  extension: undefined,
  type: undefined,
};

export const useCreateMediaStore = create<MediaType & MediaActions>()(
  (set) => ({
    ...initialState,
    setName: (name) => set(() => ({ name })),
    setMedia: (media) => set(() => ({ ...media })),
    resetMedia: () => set(() => ({ ...initialState })),
  }),
);
