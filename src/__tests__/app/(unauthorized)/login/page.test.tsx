import { render } from '@testing-library/react';

import LoginPage from '@/app/(unauthorized)/login/page';
import { useLoginUser } from '@/hooks/react-query/user/loginUser';

vi.mock('@/hooks/react-query/user/loginUser');

describe('LoginPage', () => {
  vi.mocked(useLoginUser).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    error: null
  });
  it('should render LoginPage', () => {
    const wrapper = render(<LoginPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
