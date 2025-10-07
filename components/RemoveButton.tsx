import { Dispatch, SetStateAction } from 'react';

type TProps = {
  tableCurrencies: string[];
  setTableCurrencies: Dispatch<SetStateAction<string[]>>;
  index: number;
};

export default function RemoveButton(props: TProps) {
  const { tableCurrencies, setTableCurrencies, index } = props;

  const isButtonDisabled = tableCurrencies.length <= 3;

  return (
    <td className="border-b border-gray-300 px-3 py-2 flex justify-center">
      <button
        disabled={isButtonDisabled}
        onClick={() =>
          setTableCurrencies((prev) => prev.filter((_, i) => i !== index))
        }
        className={`bg-white hover:bg-gray-200 ${
          isButtonDisabled ? 'text-gray-400' : 'text-gray-600'
        } font-semibold py-1 px-3 border border-gray-400 rounded shadow`}
      >
        –
      </button>
    </td>
  );
}
