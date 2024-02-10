import RouteIcon from '@/components/ui/route-icon';
import TeamIcon from '@/components/ui/team-icon';
import Link from 'next/link';
import { IoAddSharp } from 'react-icons/io5';

const types = {
  add_client: {
    title: 'Add client',
    color: 'from-blue-600 to-sky-400',
    icon: IoAddSharp,
    href: '/clients/new'
  },
  route_dashboard: {
    title: 'Route dashboard',
    color: 'from-emerald-400 to-stone-400',
    icon: RouteIcon,
    href: '/routes'
  },
  my_team: {
    title: 'My team',
    color: 'from-red-500 to-orange-300',
    icon: TeamIcon,
    href: '/team'
  }
};

type ActionButtonType = 'add_client' | 'route_dashboard' | 'my_team';

type Props = {
  type: ActionButtonType;
};

export default function ActionButton({ type }: Props) {
  const Icon = types[type].icon;
  return (
    <Link
      href={types[type].href}
      className={`flex shrink grow basis-0 items-center justify-start gap-2 self-stretch rounded-lg border border-zinc-200 bg-gradient-to-b p-5 ${types[type].color}`}
    >
      <Icon color="white" />
      <div className="TitleNumbers inline-flex shrink grow basis-0 flex-col items-start justify-start gap-2 self-stretch">
        <div className="Text font-['Public Sans'] self-stretch text-lg font-bold tracking-tight text-white">
          {types[type].title}
        </div>
      </div>
    </Link>
  );
}
