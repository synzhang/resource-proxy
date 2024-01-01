import { NextRequest, NextResponse } from 'next/server';

// 'nodejs' is the default
export const runtime = 'edge';

// Available languages and regions for Google AI Studio and Gemini API
// https://ai.google.dev/available_regions
// https://vercel.com/docs/concepts/edge-network/regions
export const preferredRegion = [
  'cle1',
  'iad1',
  'pdx1',
  'sfo1',
  'sin1',
  'syd1',
  'hnd1',
  'kix1',
];

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com'
const CORS_HEADERS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'Content-Type',
};
const COMMON_HEADERS: Record<string, string> = {
  ...CORS_HEADERS,
  'Cache-Control': 'no-store',
};

const buildURL = (request: NextRequest) => {
  const path = `${request.nextUrl.pathname}`.replaceAll('/api/gemini/', '');

  return `${GEMINI_BASE_URL}/${path}`;
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
  const options: RequestInit = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: request.method,
    body: request.body,
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