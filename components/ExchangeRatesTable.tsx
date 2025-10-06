//use client

type TProps = {
  initialData: any;
};

export default function ExchangeRatesTable({ initialData }: TProps) {
  const endDate = '2025-10-07';
  const baseCurrency = 'usd';

  const dataMap: Record<string, Record<string, number>> = {};

  let fetchedData = initialData;

  const matchingDates = fetchedData.map(
    (data: { date: string; [key: string]: any }) => {
      const date = data.date;
      dataMap[date] = data[baseCurrency];
      return date;
    },
  );
  const matchingCurrencies = ['usd', 'eur', 'jpy', 'chf', 'cad', 'aud', 'zar'];

  return (
    <>
      <div>{`Base Currency: ${baseCurrency.toUpperCase()}`}</div>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Currency</th>
            {matchingDates.map((d: string) => (
              <th key={d} className="border border-gray-300 px-4 py-2">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matchingCurrencies.map((currency, index) => {
            return (
              <tr key={currency} className="text-center">
                <td className="border border-gray-300 px-4 py-2 font-bold">
                  {currency.toUpperCase()}
                </td>
                {matchingDates.map((date: string) => {
                  const matchingValue = dataMap[date][currency];
                  return (
                    <td key={date} className="border border-gray-300 px-4 py-2">
                      <div>{matchingValue}</div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
