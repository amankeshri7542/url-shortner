import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LAMBDA_REDIRECT_API = 'https://y1iyd6cvtc.execute-api.us-east-1.amazonaws.com/url-shortner-prod';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for:
  // - Next.js internals (_next)
  // - API routes
  // - Static files
  // - Known routes (/, /work, /url-shortner, etc.)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/work') ||
    pathname.startsWith('/url-shortner') ||
    pathname === '/' ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Extract potential short code (e.g., /abc123)
  const shortCode = pathname.slice(1); // Remove leading slash

  // Only proceed if it looks like a short code (6 chars, alphanumeric)
  if (shortCode.length === 6 && /^[a-z0-9]+$/.test(shortCode)) {
    try {
      // Fetch original URL from Lambda
      const response = await fetch(`${LAMBDA_REDIRECT_API}/${shortCode}`);
      
      if (response.status === 301 || response.status === 302) {
        const location = response.headers.get('Location');
        if (location) {
          return NextResponse.redirect(location);
        }
      }
      
      // If not found, continue to 404 page
      return NextResponse.next();
    } catch (error) {
      console.error('Redirect error:', error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};