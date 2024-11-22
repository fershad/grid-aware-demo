import { NextRequest, NextResponse } from 'next/server';
import { geolocation, getEnv } from '@vercel/functions';
 
// Trigger this middleware to run on these route
export const config = {
  matcher: '/power-breakdown',
};
 
export default function middleware(request) {
  // Extract country. Default to US if not found.
  const { country = 'US' } = geolocation(request);
 
  // Rewrite to URL
  return new Response(`You're visiting from beautiful ${country}`)
}