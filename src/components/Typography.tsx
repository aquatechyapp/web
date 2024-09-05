import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  className?: string;
};

const defaultClassName = {
  h1: 'text-xl font-semibold',
  h2: 'text-lg font-semibold',
  h3: 'text-base font-semibold',
  h4: 'text-sm font-semibold',
  h5: 'text-xs font-semibold',
  h6: 'text-xs font-normal',
  p: 'text-base font-normal',
  span: 'text-base font-normal'
};

export function Typography({ children, element = 'p', className }: Props) {
  const Element = element as keyof JSX.IntrinsicElements;
  return <Element className={cn('text-gray-800', defaultClassName[element], className)}>{children}</Element>;
}
