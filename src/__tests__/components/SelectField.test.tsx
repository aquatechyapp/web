import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import SelectField from '@/components/SelectField';

import { FormProviderMocked } from '../providers/formProviderMocked';

const SelectFieldWrappedWithForm = () => {
  const form = useForm({
    defaultValues: {
      date: ''
    }
  });
  return (
    <FormProviderMocked form={form}>
      <SelectField
        form={form}
        name="date"
        placeholder="Select a date"
        label="Date"
        data={[{ name: 'label', value: 'value', key: 'key' }]}
      />
    </FormProviderMocked>
  );
};

describe('SelectField', () => {
  it('should render the SelectField component', () => {
    const wrapper = render(<SelectFieldWrappedWithForm />);
    expect(wrapper).toMatchSnapshot();
  });
});
