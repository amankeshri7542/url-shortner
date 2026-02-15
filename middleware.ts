import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LAMBDA_REDIRECT_API = 'https://y1iyd6cvtc.execute-api.us-east-1.amazonaws.com/url-shortner-prod';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for known routes and assets
  const skipPaths = [
    '/_next',
    '/api',
    '/work',
    '/url-shortner',
    '/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
  ];
  
  // Check if path should be skipped
  if (skipPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Check for static file extensions
  if (pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf|eot)$/)) {
    return NextResponse.next();
  }

  // Extract potential short code
  const shortCode = pathname.slice(1);

  // Only proceed if it looks like a short code (6 chars, alphanumeric)
  if (shortCode.length === 6 && /^[a-z0-9]+$/.test(shortCode)) {
    try {
      console.log(`Attempting redirect for short code: ${shortCode}`);
      
      const response = await fetch(`${LAMBDA_REDIRECT_API}/${shortCode}`, {
        method: 'GET',
        redirect: 'manual', // Important: don't auto-follow redirects
      });
      
      console.log(`Lambda response status: ${response.status}`);
      
      if (response.status === 301 || response.status === 302) {
        const location = response.headers.get('Location');
        console.log(`Redirecting to: ${location}`);
        
        if (location) {
          return NextResponse.redirect(location, response.status);
        }
      }
      
      if (response.status === 404) {
        // Short code not found, let Next.js handle 404
        console.log('Short code not found');
        return NextResponse.next();
      }
      
    } catch (error) {
      console.error('Redirect error:', error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};