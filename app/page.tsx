import ExchangeRatesPage from '@/components/ExchangeRatesPage';

export default async function Home({ searchParams }: { searchParams: any }) {
  const params = await searchParams;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-gray-800 text-white p-4 px-9 shadow-md">
        <div>Exchange Rates Viewer</div>
      </header>
      <main className="flex-1 sm:p-5 p-2">
        <ExchangeRatesPage searchParams={params} />
      </main>
      <footer className="w-full bg-gray-900 text-white p-4 mt-auto text-right">
        © 2025 Exchange Rates
      </footer>
    </div>
  );
}
