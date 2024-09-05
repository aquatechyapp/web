import Link from 'next/link';

import { useUserStore } from '@/store/user';
import { getInitials } from '@/utils/others';

import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../components/ui/dropdown-menu';

type Props = {
  handleLogout: () => void;
};

export function AccountDropdownMenu({ handleLogout }: Props) {
  const { user } = useUserStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer border">
          <AvatarImage src={''} />
          <AvatarFallback>{getInitials(`${user.firstName} ${user.lastName}`)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {/* <DropdownMenuLabel>Menu</DropdownMenuLabel> */}
        {/* <Separator /> */}
        <DropdownMenuItem>
          <Link href="/account">My Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Change Password</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <span className="text-red-500">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
