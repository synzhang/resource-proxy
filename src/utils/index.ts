export const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com'

export const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
};

export const COMMON_HEADERS: Record<string, string> = {
  ...CORS_HEADERS,
  'Cache-Control': 'no-store',
};

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