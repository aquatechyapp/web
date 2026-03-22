import { redirect } from 'next/navigation';

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function SubscriptionRedirectPage({ searchParams }: Props) {
  const params = new URLSearchParams();
  const status = searchParams.status;
  const session_id = searchParams.session_id;
  if (typeof status === 'string') params.set('status', status);
  if (typeof session_id === 'string') params.set('session_id', session_id);
  const q = params.toString();
  redirect(q ? `/settings/subscription?${q}` : '/settings/subscription');
}
