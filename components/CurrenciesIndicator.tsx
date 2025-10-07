type TProps = {
  tableCurrencies: string[];
};

export default function CurrenciesIndicator(props: TProps) {
  const { tableCurrencies = [] } = props;

  return (
    <div className="text-gray-500 mr-4 mt-2 self-center text-right text-sm">
      {tableCurrencies.length} / 7 currencies
    </div>
  );
}
