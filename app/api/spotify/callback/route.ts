import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '../../../../lib/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const userId = searchParams.get('state'); // We'll pass userId as state

  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard?spotify_error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code || !userId) {
    return NextResponse.redirect(
      new URL('/dashboard?spotify_error=missing_code', request.url)
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    
    // Store tokens in Firestore using admin SDK directly
    const { adminDb } = await import('../../../../lib/firebase-admin');
    const { Timestamp } = await import('firebase-admin/firestore');
    
    const expiresAt = Timestamp.fromMillis(Date.now() + (tokens.expiresIn * 1000));
    const tokensRef = adminDb.collection('users').doc(userId).collection('spotifyTokens').doc('tokens');
    await tokensRef.set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt,
      updatedAt: Timestamp.now(),
    });
    
    return NextResponse.redirect(
      new URL(`/dashboard?spotify_success=true`, request.url)
    );
  } catch (error: any) {
    console.error('Spotify callback error:', error);
    return NextResponse.redirect(
      new URL(
        `/dashboard?spotify_error=${encodeURIComponent(error.message)}`,
        request.url
      )
    );
  }
}

