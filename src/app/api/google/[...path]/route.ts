import { NextRequest, NextResponse } from 'next/server';
import {
  CORS_HEADERS,
  COMMON_HEADERS,
  GEMINI_BASE_URL,
  preferredRegion,
} from '@/utils'

// 'nodejs' is the default
export const runtime = 'edge';

export { preferredRegion };

const buildURL = (request: NextRequest) => {
  const url = new URL(request.nextUrl);
  const path = `${request.nextUrl.pathname}`.replaceAll('/api/google/', '');
  const key = url.searchParams.get('key');

  return `${GEMINI_BASE_URL}/${path}?key=${key}`;
};

export const GET = async (request: NextRequest) => {
  const url = buildURL(request);
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  return NextResponse.json({ data }, {
    headers: COMMON_HEADERS,
    status: 200,
  });
};

export const OPTIONS = async () => {
  return NextResponse.json({ body: 'OK' }, {
    headers: COMMON_HEADERS,
    status: 200,
  });
};

export const POST = async (request: NextRequest) => {
  const url = buildURL(request);
  const body = await request.json()
  const options: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    method: request.method,
    body: typeof body === 'object' ? JSON.stringify(body) : null,
    redirect: 'manual',
    // @ts-ignore
    duplex: 'half',
  };
  const response = await fetch(url, options);
  const responseHeaders = {
    ...CORS_HEADERS,
    ...response.headers,
    'X-Accel-Buffering': 'no',
  };

  return new NextResponse(response.body, {
    headers: responseHeaders,
    status: response.status,
    statusText: response.statusText,
  });
};