import Link from 'next/link';
import { useState, useEffect } from 'react';

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (user.firstName && user.lastName) {
      setIsLoaded(true);
    }
  }, [user.firstName, user.lastName]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isLoaded ? (
          <Avatar className="cursor-pointer border">
            <AvatarImage src={''} />
            <AvatarFallback>{getInitials(`${user.firstName} ${user.lastName}`)}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {/* <DropdownMenuLabel>Menu</DropdownMenuLabel> */}
        {/* <Separator /> */}
        <DropdownMenuItem>
          <Link href="/account">My Account</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <span className="text-red-500">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
