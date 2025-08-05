// app/api/auth/google/route.js
import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Get the base URL dynamically
function getBaseUrl(request) {
  // In production, use NEXTAUTH_URL if set, otherwise use the request URL
  if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes('localhost')) {
    return process.env.NEXTAUTH_URL;
  }
  
  // For Vercel deployment, use the request headers
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  
  return `${protocol}://${host}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'login'; // login or signup
  
  // Get the correct base URL
  const baseUrl = getBaseUrl(request);
  const REDIRECT_URI = `${baseUrl}/api/auth/google/callback`;
  
  // Store the type in the state parameter to remember it after OAuth
  const state = Buffer.from(JSON.stringify({ type })).toString('base64');
  
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('state', state);
  
  return NextResponse.redirect(googleAuthUrl.toString());
}