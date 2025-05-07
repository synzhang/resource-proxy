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

const GEMINI_API_KEYS = process.env.GEMINI_API_KEYS?.split(',').map(k => k.trim()) || [];
const VALID_TOKENS = process.env.VALID_TOKENS?.split(',').map(t => t.trim()) || [];

export const OPTIONS = async () => {
  return NextResponse.json({ body: 'OK' }, {
    headers: COMMON_HEADERS,
    status: 200,
  });
};

export const POST = async (request: NextRequest, response: NextResponse) => {
  const searchParams = request.nextUrl.searchParams;
  const clientToken = searchParams.get('key');

  // 1. 验证自定义 token
  if (!clientToken || !VALID_TOKENS.includes(clientToken)) {
    return NextResponse.json({
      code: 403,
      message: "Invalid or missing token",
      status: "PERMISSION_DENIED",
    }, {
      headers: COMMON_HEADERS,
      status: 403,
      statusText: "PERMISSION_DENIED",
    });
  }

  // 2. 构建 Gemini API URL
  const path = `${request.nextUrl.pathname}`.replaceAll('/api/google/aggregate/', '');
  const queryParams = new URLSearchParams(searchParams);
  queryParams.delete('key'); // 不把 clientToken 传给 Gemini API

  const fullGeminiUrlBase = `${GEMINI_BASE_URL}/${path}`;
  const body = await request.json()
  const errorMessages = []
  const responseHeaders = {
    ...CORS_HEADERS,
    ...response.headers,
    'X-Accel-Buffering': 'no',
  };

  // 3. 轮询 key 尝试请求
  for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
    const geminiKey = GEMINI_API_KEYS[i];
    const urlWithKey = `${fullGeminiUrlBase}?key=${geminiKey}`;

    try {
      const response = await fetch(urlWithKey, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        method: request.method,
        body: JSON.stringify(body),
        redirect: 'manual',
        // @ts-ignore
        duplex: 'half',
      });

      if (response.ok) {
        return new NextResponse(response.body, {
          headers: responseHeaders,
          status: response.status,
          statusText: response.statusText,
        });
      } else {
        const errorMessage = await response.text()
        errorMessages.push(`Status ${response.status}: ${errorMessage}`);
      }
    } catch (error: any) {
      errorMessages.push(error.message);
    }
  }

  // 所有 key 都失败
  const lastErrorMessage = errorMessages[errorMessages.length - 1];

  return NextResponse.json({
    code: 502,
    message: `Failed: ${lastErrorMessage}`,
    status: 'UNAVAILABLE',
  }, {
    headers: responseHeaders,
    status: 502,
    statusText: response.statusText,
  });
}
