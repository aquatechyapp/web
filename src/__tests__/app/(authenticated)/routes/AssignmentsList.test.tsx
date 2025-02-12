import { render } from '@testing-library/react';

import { AssignmentsList } from '@/app/(authenticated)/routes/assignments/AssignmentsList';
import { useAssignmentsContext } from '@/context/assignments';

vi.mock('@/context/assignments');

describe.skip('AssignmentsList', () => {
  it('should display text "No Assignments found for this weekday" when have not assignments', async () => {
    const wrapper = render(<AssignmentsList handleDragEnd={() => {}} />);
    expect(wrapper.getByText('No assignments found for this weekday')).toBeInTheDocument();
  });

  it('should render all Assignments', async () => {
    vi.mocked(useAssignmentsContext).mockReturnValue({
      assignments: {
        current: [
          {
            id: '1',
            order: 1,
            weekday: 'Monday',
            // generate a time value
            startOn: new Date('2024-07-08T08:00:00.000Z'),
            endAfter: new Date('2024-14-08T08:00:00.000Z'),
            pool: {
              id: '1',
              name: 'Pool 1',
              address: 'Address 1'
            },
            technician: {
              id: '1',
              firstName: 'Zezinho'
            }
          }
        ]
      }
    });
    const wrapper = render(<AssignmentsList handleDragEnd={() => {}} />);
    expect(wrapper.getByText('Assignment 1')).toBeInTheDocument();
    expect(wrapper.getByText('Assignment 2')).toBeInTheDocument();
  });
});
