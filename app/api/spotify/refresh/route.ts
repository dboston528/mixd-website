import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '../../../../lib/spotify';
import { adminDb } from '../../../../lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get current tokens
    const tokensRef = adminDb.collection('users').doc(userId).collection('spotifyTokens').doc('tokens');
    const tokensSnap = await tokensRef.get();

    if (!tokensSnap.exists || !tokensSnap.data()?.refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token found' },
        { status: 404 }
      );
    }

    const refreshToken = tokensSnap.data()?.refreshToken;
    
    // Refresh the access token
    const newTokens = await refreshAccessToken(refreshToken);
    
    // Update tokens in Firestore
    const expiresAt = Timestamp.fromMillis(Date.now() + (newTokens.expiresIn * 1000));
    await tokensRef.update({
      accessToken: newTokens.accessToken,
      expiresAt,
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      accessToken: newTokens.accessToken,
      expiresIn: newTokens.expiresIn,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to refresh token', message: error.message },
      { status: 500 }
    );
  }
}

