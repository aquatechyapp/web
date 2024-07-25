import { UseFormReturn } from 'react-hook-form';

import { Form } from '@/components/ui/form';

type IProps = {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
};

export function FormProviderMocked({ children, form }: IProps) {
  return <Form {...form}>{children}</Form>;
}
