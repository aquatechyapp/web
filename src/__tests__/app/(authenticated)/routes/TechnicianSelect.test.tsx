import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';

import TechnicianSelect from '@/app/(authenticated)/routes/TechnicianSelect';
import { useTechniciansStore } from '@/store/technicians';

vi.mock('@/store/technicians');

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || 'mouse';
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

describe('TechnicianSelect', () => {
  vi.mocked(useTechniciansStore).mockReturnValue({
    assignmentToId: '1',
    technicians: [
      {
        subcontractor: {
          id: '1',
          firstName: 'Zezinho'
        }
      },
      {
        subcontractor: {
          id: '2',
          firstName: 'Pedrinho'
        }
      }
    ]
  });
  it('should render all Technicians', async () => {
    const user = userEvent.setup();
    render(<TechnicianSelect onChange={() => {}} />);
    const open = screen.getByTestId('select-technician');
    await user.click(open);
    expect(within(screen.getByRole('listbox')).getByText('Zezinho')).toBeInTheDocument();
    expect(within(screen.getByRole('listbox')).getByText('Pedrinho')).toBeInTheDocument();
  });
});
