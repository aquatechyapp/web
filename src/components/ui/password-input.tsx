'use client';
import * as React from 'react';
import { Icon } from '@iconify/react';

import { cn } from '../../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
          {showPassword ? (
            <Icon
              icon="streamline:visible-solid"
              className="h-4 w-4"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <Icon
              icon="streamline:invisible-1-solid"
              className="h-4 w-4"
              onClick={togglePasswordVisibility}
            />
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input as PasswordInput };
