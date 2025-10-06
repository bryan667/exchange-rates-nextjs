import { NextRequest, NextResponse } from 'next/server';
import cache from '@/lib/cache';

const userAgent: string = 'exchange-rates-nextjs(janbryanmartirez@gmail.com)';

export async function GET(request: NextRequest) {
  const cacheKey = `defaultURL-currencies`;
  const cachedData = await cache.get(cacheKey);

  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  const defaultURL =
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json';
  const res = await fetch(defaultURL, {
    headers: {
      'User-Agent': userAgent,
    },
  });
  if (res.ok) {
    const data = await res.json();
    await cache.set(cacheKey, data);
    return NextResponse.json(data);
  }

  const fallbackCacheKey = `fallbackUrl-currencies`;
  const fallbackCachedData = await cache.get(fallbackCacheKey);
  if (fallbackCachedData) {
    return NextResponse.json(fallbackCachedData);
  }

  const fallbackUrl =
    'https://latest.currency-api.pages.dev/v1/currencies.min.json';
  const fallbackRes = await fetch(fallbackUrl, {
    headers: {
      'User-Agent': userAgent,
    },
  });
  const fallbackData = await fallbackRes.json();
  return NextResponse.json(fallbackData);
}
