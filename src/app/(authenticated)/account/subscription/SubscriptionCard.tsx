import { CheckCircle2 } from 'lucide-react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChangeSubscription } from '@/hooks/react-query/user/changeSubscription';
import { UserSubscription } from '@/ts/enums/enums';
import { Plan } from '@/ts/interfaces/Pricing';

type Props = {
  plan: Plan;
  currentUserPlan: UserSubscription;
};

export function SubscriptionCard({ plan, currentUserPlan }: Props) {
  const { title, price, features, extra } = plan;
  const isCurrentPlan = plan.name === currentUserPlan;
  const currentPlanClass = isCurrentPlan ? 'border-4 border-double border-blue-500 bg-blue-100' : '';

  const { mutate, isPending, isSuccess, data } = useChangeSubscription(plan.name);

  if (isSuccess && data?.data) {
    window.open(data.data, '_blank', 'noreferrer');
  }

  return (
    <>
      {/* Fazendo assim pois se renderizar somente o Loading, some o Card que o user clicou */}
      {isPending && <LoadingSpinner />}
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
          <Button onClick={() => mutate()} disabled={isCurrentPlan} className="text-md w-full">
            {isCurrentPlan ? 'Current Plan' : plan.name !== UserSubscription.GROW ? 'Downgrade' : 'Subscribe'}
          </Button>
          <ul className="mt-6 w-full space-y-2 text-gray-700">
            {features.map((f) => (
              <li key={f.text} className="flex w-full gap-2">
                <div className="flex size-6 justify-center text-blue-500">
                  {f.include ? <CheckCircle2 /> : <div className="size-[22px] rounded-full border-2 border-blue-500" />}
                </div>
                <span className="text-r">{f.text}</span>
              </li>
            ))}
          </ul>
          {extra && <span className="mt-4 self-start text-sm font-semibold text-gray-500">{extra}</span>}
        </CardContent>
      </Card>
    </>
  );
}
