import { NextRequest, NextResponse } from 'next/server';
import {
  formatDateLocal,
  filterUnwantedCurrencies,
  parseSelectedCurrencies,
} from '@/lib/helpers';
import cache from '@/lib/cache';

const userAgent: string = 'exchange-rates-nextjs(janbryanmartirez@gmail.com)';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const baseCurrency: string =
    searchParams.get('base-currency')?.toLowerCase() || 'gbp';
  const date = searchParams.get('end-date') || new Date();
  const selectedCurrenciesParams =
    searchParams.get('selected-currencies') ?? 'usd,eur,jpy,chf,cad,aud,zar';

  let uniqSelectedCurrencies = parseSelectedCurrencies({
    selectedCurrenciesParams,
  });

  const endDate = new Date(date);
  const fullData: { [key: string]: any }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    const formattedDate = formatDateLocal(d);
    const cacheKey = `exchange-history-${formattedDate}-${baseCurrency}`;
    const cachedData = await cache.get(cacheKey);

    if (cachedData) {
      fullData.push(cachedData);
      continue;
    }

    const defaultURL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${formattedDate}/v1/currencies/${baseCurrency}.min.json`;
    const res = await fetch(defaultURL, {
      headers: {
        'User-Agent': userAgent,
      },
    });

    if (res.ok) {
      const data = await res.json();
      await cache.set(cacheKey, data);
      fullData.push(data);
      continue;
    }

    const fallbackUrl = `https://latest.currency-api.pages.dev/@${formattedDate}/v1/currencies/${baseCurrency}.min.json`;
    const fallbackRes = await fetch(fallbackUrl, {
      headers: {
        'User-Agent': userAgent,
      },
    });

    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      await cache.set(cacheKey, fallbackData);
      fullData.push(fallbackData);
      continue;
    }
  }

  const filteredData = filterUnwantedCurrencies({
    fullData,
    baseCurrency,
    uniqSelectedCurrencies,
  });

  return NextResponse.json(filteredData);
}
