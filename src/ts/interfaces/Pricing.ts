import { UserSubscription } from '@/ts/enums/enums';

export type Plan = {
  name: UserSubscription;
  title: string;
  price: number;
  description: string;
  features: {
    text: string;
    include: boolean;
  }[];
  extra?: string;
};
