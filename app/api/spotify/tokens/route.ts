import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, accessToken, refreshToken, expiresIn } = body;

    if (!userId || !accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate expiration time
    const expiresAt = Timestamp.fromMillis(Date.now() + (expiresIn * 1000));

    // Store tokens in Firestore using admin SDK
    const tokensRef = adminDb.collection('users').doc(userId).collection('spotifyTokens').doc('tokens');
    await tokensRef.set({
      accessToken,
      refreshToken,
      expiresAt,
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to store tokens', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID required' },
      { status: 400 }
    );
  }

  try {
    const tokensRef = adminDb.collection('users').doc(userId).collection('spotifyTokens').doc('tokens');
    const tokensSnap = await tokensRef.get();

    if (!tokensSnap.exists) {
      return NextResponse.json({ tokens: null });
    }

    const data = tokensSnap.data();
    return NextResponse.json({
      tokens: {
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
        expiresAt: data?.expiresAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch tokens', message: error.message },
      { status: 500 }
    );
  }
}

