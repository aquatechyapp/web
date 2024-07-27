import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';

type WithFormControlProps = {
  name: string;
  label?: string;
};

export function withFormControl<T extends WithFormControlProps>(Component: React.ElementType) {
  return ({ name, label, ...props }: T) => {
    const form = useFormContext();

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          return (
            <FormItem className="w-full">
              <Label>{label}</Label>
              <FormControl>
                <Component {...field} {...props} form={form} field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  };
}
