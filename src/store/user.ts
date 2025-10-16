import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { UserSubscription } from '@/ts/enums/enums';

import { User } from '../ts/interfaces/User';
import { Dashboard } from '../ts/interfaces/Dashboard';

type Store = {
  user: User;
  dashboard: Dashboard;
  isFreePlan: boolean;
  reachedPoolLimit: boolean;
  shouldDisableNewPools: boolean;
};

type Actions = {
  setUser: (user: User) => void;
  setDashboard: (dashboard: Dashboard) => void;
  resetUser: () => void;
};

const poolsLimitBySubscription = {
  [UserSubscription.FREE]: 30,
  [UserSubscription.GROW]: 1000
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
    dashboard: {} as Dashboard,
    setDashboard: (dashboard: Dashboard) => {
      set({ dashboard });
    },
    resetUser: () => {
      set({
        user: {} as User,
        dashboard: {} as Dashboard,
        isFreePlan: false,
        reachedPoolLimit: false,
        shouldDisableNewPools: false,
      });
    },
    isFreePlan: false,
    reachedPoolLimit: false,
    shouldDisableNewPools: false
  }))
);
