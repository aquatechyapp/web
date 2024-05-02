import { UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Props = {
  form: UseFormReturn;
};

export const OptionsClientType = ({ form }: Props) => {
  return (
    <FormField
      control={form.control}
      name="clientType"
      render={({ field }) => (
        <div className="mt-2 flex">
          <FormItem className="space-y-2">
            <FormLabel>Client Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-y-1 pt-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Commercial" />
                  </FormControl>
                  <FormLabel>Commercial</FormLabel>
                </FormItem>
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  // Necessário pois tinha um space-y aplicando um margin-top
                  style={{ marginTop: 0 }}
                >
                  <FormControl>
                    <RadioGroupItem value="Residential" />
                  </FormControl>
                  <FormLabel>Residential</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
      )}
    />
  );
};
