import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns';
import cache from '@/lib/cache';
import { defaultParameters } from '@/lib/helpers';

const userAgent: string = 'exchange-rates-nextjs(janbryanmartirez@gmail.com)';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const baseCurrency: string =
    searchParams.get('base-currency')?.toLowerCase() ||
    defaultParameters.baseCurrency;
  const dateParam = searchParams.get('end-date');
  const date = isNaN(new Date(dateParam || '').getTime())
    ? new Date(defaultParameters.endDate)
    : new Date(dateParam!);

  const endDate = new Date(date);
  const dates: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    dates.push(format(d, 'yyyy-MM-dd'));
  }

  const promises: Promise<any>[] = [];

  for (const formattedDate of dates) {
    const dataPromise = (async () => {
      const cacheKey = `exchange-history-${formattedDate}-${baseCurrency}`;
      const cachedData = await cache.get(cacheKey);
      if (cachedData) return cachedData;

      const urls = [
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${formattedDate}/v1/currencies/${baseCurrency}.min.json`,
        `https://latest.currency-api.pages.dev/@${formattedDate}/v1/currencies/${baseCurrency}.min.json`,
      ];

      for (const url of urls) {
        try {
          const res = await fetch(url, {
            headers: { 'User-Agent': userAgent },
          });
          if (res.ok) {
            const data = await res.json();
            await cache.set(cacheKey, data);
            return data;
          }
        } catch (err) {
          console.error(`Fetch failed for ${formattedDate}:`, err);
        }
      }
      return null;
    })();

    promises.push(dataPromise);
  }

  const results = await Promise.all(promises);
  const fullData = results.filter(Boolean);

  return NextResponse.json(fullData);
}
