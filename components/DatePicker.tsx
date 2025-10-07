'use-client';
import { format, subDays } from 'date-fns';

type TProps = {
  selectedDate: string;
  setSelectedDate: (params: string) => void;
  isLoading?: boolean;
};

export default function DatePicker(props: TProps) {
  const { selectedDate, setSelectedDate, isLoading } = props;

  return (
    <input
      type="date"
      className="mr-5"
      max={format(new Date(), 'yyyy-MM-dd')}
      min={format(subDays(new Date(), 90), 'yyyy-MM-dd')}
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      disabled={isLoading}
    />
  );
}
