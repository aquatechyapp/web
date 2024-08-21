import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { UserSubscription } from '@/constants/enums';

import { User } from '../interfaces/User';

type Store = {
  user: User;
  isFreePlan: boolean;
  reachedPoolLimit: boolean;
  shouldDisableNewPools: boolean;
};

type Actions = {
  setUser: (user: User) => void;
};

export const useUserStore = create<Store & Actions>()(
  devtools((set) => ({
    user: {} as User,
    setUser: (user: User) =>
      set({
        user,
        isFreePlan: user.subscription === UserSubscription.FREE,
        reachedPoolLimit: user.poolsCount >= 10,
        shouldDisableNewPools: user.subscription === UserSubscription.FREE && user.poolsCount >= 10
      }),
    isFreePlan: false,
    reachedPoolLimit: false,
    shouldDisableNewPools: false
  }))
);
