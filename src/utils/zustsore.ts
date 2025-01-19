import { create } from "zustand";

interface State {
  userDetails:{
    email: string;
    bucketId: string;
  }
}
export const useStore = create<State>()(() => ({
  userDetails: {
    email: "",
    bucketId: "",
  },
}));
