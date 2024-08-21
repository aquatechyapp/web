import { CheckCircle2 } from 'lucide-react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserSubscription } from '@/constants/enums';
import { useChangeSubscription } from '@/hooks/react-query/user/changeSubscription';
import { Plan } from '@/interfaces/Pricing';

type Props = {
  plan: Plan;
  currentPlan: UserSubscription;
};

export function SubscriptionCard({ plan, currentPlan }: Props) {
  const { title, price, description, features } = plan;
  const isCurrentPlan = plan.name === currentPlan;
  const currentPlanClass = isCurrentPlan ? 'border-4 border-double border-blue-500 bg-blue-100' : '';

  const { mutate, isPending, isSuccess, data } = useChangeSubscription(plan.name);

  if (isSuccess && data?.data) {
    window.open(data.data, '_blank', 'noreferrer');
  }

  if (isPending) return <LoadingSpinner />;

  return (
    <Card className={currentPlanClass}>
      <CardHeader className="flex items-center">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <p className="text-gray-500">Starting at</p>
        <p className="mb-2 mt-1 text-4xl font-semibold text-gray-800">
          ${price}
          <span className="text-lg font-normal">/month</span>
        </p>
        <p className="mb-4 text-gray-500">{description}</p>
        <Button onClick={() => mutate()} disabled={isCurrentPlan} className="text-md w-full">
          {isCurrentPlan ? 'Current Plan' : 'Upgrade'}
        </Button>
        <ul className="mt-6 w-full space-y-2 text-gray-700">
          {features.map((f) => (
            <li key={f.text} className="flex w-full gap-2">
              <div className="size-6 text-blue-500">{f.include && <CheckCircle2 />}</div>
              <span className="text-r">{f.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
