import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { UserSubscription } from '@/ts/enums/enums';

import { User } from '../ts/interfaces/User';

type Store = {
  user: User;
  isFreePlan: boolean;
  reachedPoolLimit: boolean;
  shouldDisableNewPools: boolean;
};

type Actions = {
  setUser: (user: User) => void;
};

const poolsLimitBySubscription = {
  [UserSubscription.FREE]: 30,
  [UserSubscription.GROW]: 150
};

export const useUserStore = create<Store & Actions>()(
  devtools((set) => ({
    user: {} as User,
    setUser: (user: User) => {
      set({
        user,
        isFreePlan: user.subscription === UserSubscription.FREE,
        reachedPoolLimit: user.poolsCount >= poolsLimitBySubscription[user.subscription],
        shouldDisableNewPools: user.poolsCount >= poolsLimitBySubscription[user.subscription]
      });
    },
    isFreePlan: false,
    reachedPoolLimit: false,
    shouldDisableNewPools: false
  }))
);
