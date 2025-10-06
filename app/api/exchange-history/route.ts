import { NextRequest, NextResponse } from 'next/server';
import { formatDateLocal } from '@/lib/helpers';
import cache from '@/lib/cache';

const userAgent: string = 'exchange-rates-nextjs(janbryanmartirez@gmail.com)';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const baseCurrency: string =
    searchParams.get('currency')?.toLowerCase() || 'gbp';
  const date = searchParams.get('date') || new Date(); //YYYY-MM-DD

  const endDate = new Date(date);
  const history: { [key: string]: any }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    const formattedDate = formatDateLocal(d);

    const cacheKey = `defaultURL-exchange-history-${formattedDate}-${baseCurrency}`;
    const cachedData = await cache.get(cacheKey);

    if (cachedData) {
      history.push(cachedData);
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
      history.push(data);
      continue;
    }

    const fallbackUrl = `https://latest.currency-api.pages.dev/@${formattedDate}/v1/currencies/${baseCurrency}.min.json`;
    const fallbackRes = await fetch(fallbackUrl, {
      headers: {
        'User-Agent': userAgent,
      },
    });

    const fallbackCacheKey = `fallbackUrl-exchange-history-${formattedDate}-${baseCurrency}`;
    const fallbackCachedData = await cache.get(fallbackCacheKey);
    if (fallbackCachedData) {
      history.push(fallbackCachedData);
      continue;
    }

    const fallbackData = await fallbackRes.json();
    await cache.set(fallbackCacheKey, fallbackData);
    history.push(fallbackData);
  }

  return NextResponse.json(history);
}
