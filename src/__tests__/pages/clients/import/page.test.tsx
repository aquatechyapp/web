import { render } from '@testing-library/react';

import { ReactQueryMocked } from '@/__tests__/providers/reactQueryMocked';
import ClientsImportPages from '@/app/(authenticated)/clients/import/page';

vi.mock('useMutation', () => ({
  mutate: vi.fn()
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(), // Mock router.push
    replace: vi.fn(), // Mock router.replace
    prefetch: vi.fn(), // Mock router.prefetch
    pathname: '/clients/import' // Mock pathname
  })
}));

describe('/clients/import', () => {
  const wrapper = render(
    <ReactQueryMocked>
      <ClientsImportPages />
    </ReactQueryMocked>
  );

  it('should render the ImportClientsPage component', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
