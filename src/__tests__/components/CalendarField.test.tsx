import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import CalendarField from '@/components/CalendarField';

import { FormProviderMocked } from '../providers/formProviderMocked';

const DatePickerWithUseForm = () => {
  const form = useForm({
    defaultValues: {
      date: ''
    }
  });
  return (
    <FormProviderMocked form={form}>
      <CalendarField form={form} name="date" placeholder="Select a date" />;
    </FormProviderMocked>
  );
};

describe('CalendarField', () => {
  it('should render the CalendarField component', () => {
    const wrapper = render(<DatePickerWithUseForm />);
    expect(wrapper).toMatchSnapshot();
  });
});
