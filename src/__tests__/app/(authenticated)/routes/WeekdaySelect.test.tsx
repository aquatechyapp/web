import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WeekdaySelect from '@/app/(authenticated)/routes/WeekdaySelect';

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

describe('WeekdaySelect', () => {
  it('should render all Weekdays', async () => {
    const user = userEvent.setup();
    render(<WeekdaySelect onChange={() => {}} value="MONDAY" />);
    const open = screen.getByTestId('select-weekday');
    await user.click(open);
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    weekdays.forEach((weekday) => {
      expect(within(screen.getByRole('listbox')).getByText(weekday)).toBeInTheDocument();
    });
  });
});
