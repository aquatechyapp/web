import { useMutation } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { Mock } from 'vitest';

import SignupPage from '@/app/(unauthorized)/signup3/page';

vi.mock('@tanstack/react-query');

describe('SignupPage', () => {
  vi.mocked(useMutation as Mock).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    error: null
  });
  it('should render SignupPage', () => {
    const wrapper = render(<SignupPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
