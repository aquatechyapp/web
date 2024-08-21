import { UserSubscription } from '@/constants/enums';

export type Plan = {
  name: UserSubscription;
  title: string;
  price: number;
  description: string;
  features: {
    text: string;
    include: boolean;
  }[];
};
