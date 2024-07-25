import { render } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import StateAndCitySelect from '@/components/StateAndCitySelect';

import { FormProviderMocked } from '../providers/formProviderMocked';

const StateAndCitySelectWithUseForm = () => {
  const form = useForm({
    defaultValues: {
      clientState: 'FL',
      clientCity: 'Orlando'
    }
  });
  return (
    <FormProviderMocked form={form}>
      <StateAndCitySelect form={form} />
    </FormProviderMocked>
  );
};

describe('StateAndCitySelect', () => {
  const wrapper = render(<StateAndCitySelectWithUseForm />);

  it('should render the StateAndCitySelect component', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should coming with default client and city selected', () => {
    const wrapper = render(<StateAndCitySelectWithUseForm />);
    const stateSelect = wrapper.getAllByText('Florida');
    const citySelect = wrapper.getAllByText('Orlando');

    expect(stateSelect).toHaveLength(1);
    expect(citySelect).toHaveLength(1);
  });
});
