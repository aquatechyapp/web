import Link from 'next/link';

import { Avatar, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';

type Props = {
  handleLogout: () => void;
};

export function AccountDropdownMenu({ handleLogout }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="hover:cursor-pointer">
          <AvatarImage src="https://via.placeholder.com/40x40" />
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
