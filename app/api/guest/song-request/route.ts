import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../../lib/firebase-admin';
import { hashToken } from '../../../../../lib/invites';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * POST /api/guest/song-request - Submit a song request using an invite token
 * Public endpoint (validated via token)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, songTitle, artist, guestName } = body;

    // Validate required fields
    if (!token || !songTitle || !artist || !guestName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate input length (prevent abuse)
    if (songTitle.length > 200 || artist.length > 200 || guestName.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Input too long' },
        { status: 400 }
      );
    }

    // Hash the provided token
    const tokenHash = hashToken(token);

    // Find invite by token hash
    const invitesSnapshot = await adminDb
      .collection('invites')
      .where('tokenHash', '==', tokenHash)
      .limit(1)
      .get();

    if (invitesSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const inviteDoc = invitesSnapshot.docs[0];
    const inviteData = inviteDoc.data();
    const inviteRef = inviteDoc.ref;

    // Check if revoked
    if (inviteData.revoked) {
      return NextResponse.json(
        { success: false, error: 'This invite has been revoked' },
        { status: 403 }
      );
    }

    // Check if expired
    const now = new Date();
    if (inviteData.expiresAt) {
      const expiresAt = inviteData.expiresAt.toDate();
      if (expiresAt < now) {
        return NextResponse.json(
          { success: false, error: 'This invite has expired' },
          { status: 403 }
        );
      }
    }

    // Check if max uses reached
    if (inviteData.maxUses !== null && inviteData.useCount >= inviteData.maxUses) {
      return NextResponse.json(
        { success: false, error: 'This invite has reached its maximum number of uses' },
        { status: 403 }
      );
    }

    // Rate limiting: Check if last request was too recent (30 seconds)
    if (inviteData.lastUsedAt) {
      const lastUsed = inviteData.lastUsedAt.toDate();
      const secondsSinceLastUse = (now.getTime() - lastUsed.getTime()) / 1000;
      if (secondsSinceLastUse < 30) {
        return NextResponse.json(
          { success: false, error: 'Please wait before submitting another request' },
          { status: 429 }
        );
      }
    }

    // Create song request via Admin SDK
    const requestRef = adminDb.collection('songRequests').doc();
    await requestRef.set({
      eventId: inviteData.eventId,
      songTitle: songTitle.trim(),
      artist: artist.trim(),
      guestName: guestName.trim(),
      status: 'pending',
      timestamp: Timestamp.now(),
    });

    // Update invite usage stats
    await inviteRef.update({
      useCount: (inviteData.useCount || 0) + 1,
      lastUsedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      requestId: requestRef.id,
    });
  } catch (error: any) {
    console.error('Error submitting song request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit request', message: error.message },
      { status: 500 }
    );
  }
}

