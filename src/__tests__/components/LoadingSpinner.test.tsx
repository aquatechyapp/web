import { render } from '@testing-library/react';

import { LoadingSpinner } from '@/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render the LoadingSpinner component', () => {
    const wrapper = render(<LoadingSpinner />);
    expect(wrapper).toMatchSnapshot();
  });
});
