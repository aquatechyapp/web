import { UserSubscription } from '@/ts/enums/enums';

export type Plan = {
  name: UserSubscription;
  title: string;
  price: number;
  features: {
    text: string;
    include: boolean;
  }[];
  extra?: string;
};
