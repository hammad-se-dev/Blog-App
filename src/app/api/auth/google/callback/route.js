// app/api/auth/google/callback/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '@/models/User'; // Adjust path to your User model

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXTAUTH_URL + '/api/auth/google/callback';
const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=oauth_error`);
  }

  try {
    // Decode the state to get the original type (login/signup)
    const { type } = JSON.parse(Buffer.from(state, 'base64').toString());
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      throw new Error('Failed to exchange code for token');
    }

    // Get user info from Google
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`);
    const googleUser = await userResponse.json();
    
    if (!userResponse.ok) {
      console.error('User info fetch failed:', googleUser);
      throw new Error('Failed to get user info');
    }

    // Connect to database
    await connectDB();
    
    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });
    
    if (user) {
      // User exists - update with Google info if not already set
      if (!user.googleId) {
        user.googleId = googleUser.id;
        user.name = user.name || googleUser.name;
        user.avatar = user.avatar || googleUser.picture;
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      // Create new user for Google OAuth
      user = new User({
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
        avatar: googleUser.picture,
        authProvider: 'google'
        // Note: No password required for Google users
      });
      
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(), 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to callback page with token
    const redirectUrl = new URL('/auth/callback', process.env.NEXTAUTH_URL);
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('user', JSON.stringify({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar
    }));
    
    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=oauth_failed`);
  }
}