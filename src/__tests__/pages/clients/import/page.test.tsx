import { render } from '@testing-library/react';

import { ReactQueryMocked } from '@/__tests__/providers/reactQueryMocked';
import ClientsImportPages from '@/app/(authenticated)/clients/import/page';

vi.mock('useMutation', () => ({
  mutate: vi.fn()
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
