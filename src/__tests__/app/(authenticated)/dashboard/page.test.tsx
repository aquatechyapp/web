import { render } from '@testing-library/react';
import { Mock } from 'vitest';

import DashboardPage from '@/app/(authenticated)/dashboard/page';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { useUserStore } from '@/store/user';

vi.mock('@/store/user');
vi.mock('@/hooks/react-query/clients/getClients');

describe('DashboardPage', () => {
  vi.mocked(useUserStore).mockReturnValue({
    user: {
      id: '1',
      email: ''
    }
  });

  vi.mocked(useGetClients as Mock).mockReturnValue({
    data: [
      {
        id: '1',
        name: 'Client 1',
        pools: [
          {
            id: '1',
            city: 'City 1'
          }
        ]
      }
    ],
    isLoading: false
  });
  it('should render DashboardPage', () => {
    const wrapper = render(<DashboardPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
