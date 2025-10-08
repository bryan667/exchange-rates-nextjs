import { NextRequest, NextResponse } from 'next/server';
import { convertToDropdownDataFormat } from '@/lib/helpers';
import cache from '@/lib/cache';

const userAgent: string = 'exchange-rates-nextjs(janbryanmartirez@gmail.com)';

export async function GET(request: NextRequest) {
  const cacheKey = `currencies-cache`;

  try {
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
      const dropdownDataFormat = convertToDropdownDataFormat(data);
      await cache.set(cacheKey, dropdownDataFormat);
      return NextResponse.json(dropdownDataFormat);
    }

    const fallbackUrl =
      'https://latest.currency-api.pages.dev/v1/currencies.min.json';
    const fallbackRes = await fetch(fallbackUrl, {
      headers: {
        'User-Agent': userAgent,
      },
    });

    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      const fallbackDropdownDataFormat =
        convertToDropdownDataFormat(fallbackData);
      await cache.set(cacheKey, fallbackDropdownDataFormat);
      return NextResponse.json(fallbackDropdownDataFormat);
    }

    return NextResponse.json(
      { error: 'Failed to fetch currency data from both sources.' },
      { status: 502 },
    );
  } catch (error) {
    console.error('Currency API fetch failed:', error);
    return NextResponse.json(
      { error: 'Unexpected error fetching currency data.' },
      { status: 500 },
    );
  }
}
