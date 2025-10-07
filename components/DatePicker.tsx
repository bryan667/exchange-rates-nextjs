'use-client';
import { format, subDays } from 'date-fns';

type TProps = {
  selectedDate: string;
  setSelectedDate: (params: string) => void;
};

export default function DatePicker(props: TProps) {
  const { selectedDate, setSelectedDate } = props;

  return (
    <input
      type="date"
      className="mr-5"
      max={format(new Date(), 'yyyy-MM-dd')}
      min={format(subDays(new Date(), 90), 'yyyy-MM-dd')}
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
    />
  );
}
