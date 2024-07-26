import { render } from '@testing-library/react';

import { MultiSelect } from '@/components/MultiSelect';

describe('MultiSelect', () => {
  it('should render the MultiSelect component', () => {
    const wrapper = render(
      <MultiSelect
        options={[{ label: 'label', value: 'value' }]}
        selected={['selected']}
        onChange={() => {}}
        placeholder="placeholder"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
