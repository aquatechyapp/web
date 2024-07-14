import { create } from 'zustand';

import { User } from '../interfaces/User';

type UserState = {
  user: User | undefined;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: (user: User) => set({ user })
}));
