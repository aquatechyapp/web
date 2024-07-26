import { render } from '@testing-library/react';

import { DropdownTop } from '@/components/DropdownTop';

describe('DropdownTop', () => {
  it('should render the DropdownTop component', () => {
    const wrapper = render(<DropdownTop />);
    expect(wrapper).toMatchSnapshot();
  });
});
