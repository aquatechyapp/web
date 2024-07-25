import React from 'react';
import { IoSearchCircleOutline } from 'react-icons/io5';

import { cn } from '../../lib/utils';
import { InputProps } from './input';

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement>;

const Search = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn(
        'border-input ring-offset-background focus-within:ring-ring flex h-10 items-center rounded-md border bg-gray-50 pl-3 text-sm focus-within:ring-1 focus-within:ring-offset-2',
        className
      )}
    >
      <IoSearchCircleOutline className="h-[16px] w-[16px]" />
      <input
        {...props}
        type="search"
        ref={ref}
        className="placeholder:text-muted-foreground w-full p-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
});

Search.displayName = 'Search';

export { Search };
