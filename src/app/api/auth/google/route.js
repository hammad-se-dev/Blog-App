// app/api/auth/google/route.js
import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'login';
  
  // 🔍 DEBUGGING: Log all relevant information
  console.log('=== OAUTH DEBUG INFO ===');
  console.log('Environment Variables:');
  console.log('- NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
  
  console.log('Request Headers:');
  console.log('- host:', request.headers.get('host'));
  console.log('- x-forwarded-proto:', request.headers.get('x-forwarded-proto'));
  console.log('- x-forwarded-host:', request.headers.get('x-forwarded-host'));
  console.log('- origin:', request.headers.get('origin'));
  
  // Build the redirect URI
  const REDIRECT_URI = process.env.NEXTAUTH_URL + '/api/auth/google/callback';
  
  console.log('Constructed REDIRECT_URI:', REDIRECT_URI);
  console.log('========================');
  
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