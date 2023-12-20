import { NextRequest } from 'next/server';

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

const GEMINI_HOST = 'generativelanguage.googleapis.com'

const CORS_HEADERS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'Content-Type',
};

export const GET = async () => {
  const res = await fetch(`https://${GEMINI_HOST}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
 
  return Response.json({ data });
}

export const OPTIONS = async () => {
  return new Response(null, {
    headers: CORS_HEADERS,
  });
}

export const POST = async (request: NextRequest) => {
  const url = new URL(request.url);
  const targetURL = request.url.replace(url.host, GEMINI_HOST);
  const body = await request.json();

  const response = await fetch(targetURL, {
    method: request.method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: typeof body === 'object' ? JSON.stringify(body) : '{}',
  });

  const responseHeaders = {
    ...CORS_HEADERS,
    ...response.headers,
  };

  return new Response(response.body, {
    headers: responseHeaders,
    status: response.status
  });
}