import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import DatePickerField from '@/components/DatePickerField';

import { FormProviderMocked } from '../providers/formProviderMocked';

const DatePickerWithUseForm = () => {
  const form = useForm({
    defaultValues: {
      date: ''
    }
  });
  return (
    <FormProviderMocked form={form}>
      <DatePickerField form={form} name="date" placeholder="Select a date" label="Date" />
    </FormProviderMocked>
  );
};

describe('DatePickerField', () => {
  it('should render the DatePickerField component', () => {
    const wrapper = render(<DatePickerWithUseForm />);
    expect(wrapper).toMatchSnapshot();
  });
});
