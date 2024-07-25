import { create } from 'zustand';

import { User } from '../interfaces/User';

type UserState = {
  user: User;
  setUser: (user: User) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: {} as User,
  setUser: (user: User) => set({ user })
}));
