import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { User } from '../interfaces/User';

type Store = {
  user: User;
};

type Actions = {
  setUser: (user: User) => void;
};

export const useUserStore = create<Store & Actions>()(
  devtools((set) => ({
    user: {} as User,
    setUser: (user: User) => set({ user })
  }))
);
