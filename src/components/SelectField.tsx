import { SelectProps } from '@radix-ui/react-select';
import { ControllerRenderProps, FieldValues, UseFormReturn } from 'react-hook-form';

import { withFormControl } from '@/hoc/withFormControl';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type SelectFieldProps = SelectProps & {
  options: { key: string; value: string; name: string }[];
  name: string;
  placeholder: string;
  label?: string;
};

type Props = {
  field: ControllerRenderProps<FieldValues, string>;
  form: UseFormReturn;
};

function SelectField({ options, name, placeholder, form, field, ...props }: Props & SelectProps & SelectFieldProps) {
  function onValueChange(data: string) {
    field.onChange(data);
    if (props.onValueChange) {
      props.onValueChange(data);
    }
  }

  return (
    <Select {...props} defaultValue={form.watch(name)} onValueChange={onValueChange}>
      <SelectTrigger className={`${!form.getValues(name) && 'text-slate-500'}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((d) => (
            <SelectItem key={d.key} value={d.value}>
              {d.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default withFormControl<SelectFieldProps>(SelectField);
