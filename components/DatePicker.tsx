import { format, subDays } from 'date-fns';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type TProps = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  isLoading?: boolean;
};

export default function DatePicker(props: TProps) {
  const { selectedDate, setSelectedDate, isLoading } = props;
  const parsedDate = selectedDate ? new Date(selectedDate) : new Date();

  return (
    <ReactDatePicker
      id="date-picker-field"
      selected={parsedDate}
      onChange={(date: Date | null) => {
        if (date) setSelectedDate(format(date, 'yyyy-MM-dd'));
      }}
      maxDate={new Date()}
      minDate={subDays(new Date(), 90)}
      dateFormat="yyyy-MM-dd"
      disabled={isLoading}
      className="border border-gray-300 rounded px-3 py-2 text-sm  sm:w-auto"
    />
  );
}
