import { UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  children: React.ReactElement;
};

export function FormFieldWrapper({ form, children }: Props) {
  const ComponentChildren = children.type;
  return (
    <FormField
      control={form.control}
      name={'photos'}
      render={({ field }) => {
        return (
          <FormItem className="h-full w-full">
            <FormControl>
              <ComponentChildren {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
