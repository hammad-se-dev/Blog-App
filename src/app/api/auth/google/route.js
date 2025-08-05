// app/api/auth/google/route.js
import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'login';
  
  // Debug: Log environment and request details
  console.log('=== DEBUG INFO ===');
  console.log('NEXTAUTH_URL from env:', process.env.NEXTAUTH_URL);
  console.log('Request host:', request.headers.get('host'));
  console.log('Request protocol:', request.headers.get('x-forwarded-proto'));
  console.log('Request URL:', request.url);
  
  // Build redirect URI - use multiple fallback methods
  let REDIRECT_URI;
  
  if (process.env.NEXTAUTH_URL) {
    REDIRECT_URI = process.env.NEXTAUTH_URL + '/api/auth/google/callback';
  } else {
    // Fallback: build from request
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    REDIRECT_URI = `${protocol}://${host}/api/auth/google/callback`;
  }
  
  console.log('Final REDIRECT_URI:', REDIRECT_URI);
  console.log('==================');
  
  // Store the type in the state parameter
  const state = Buffer.from(JSON.stringify({ type })).toString('base64');
  
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('state', state);
  
  console.log('Full Google Auth URL:', googleAuthUrl.toString());
  
  return NextResponse.redirect(googleAuthUrl.toString());
}