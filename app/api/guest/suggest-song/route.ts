import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase-admin';
import { hashToken } from '../../../../lib/invites';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * POST /api/guest/suggest-song - Submit a song suggestion using an invite token
 * Public endpoint (validated via token)
 * 
 * Writes to:
 * - events/{eventId}/songs with addedByType="guest" (required)
 * - songRequests collection (optional, for approval workflow)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, songTitle, artist, guestName, createRequest = true } = body;

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
    const eventId = inviteData.eventId;

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

    // Write to events/{eventId}/songs with addedByType="guest" (required)
    const songsRef = adminDb.collection('events').doc(eventId).collection('songs');
    const songDocRef = songsRef.doc();
    await songDocRef.set({
      title: songTitle.trim(),
      artist: artist.trim(),
      tag: 'neutral', // Default tag for guest suggestions
      sourceType: 'manual',
      addedByType: 'guest',
      addedByGuestName: guestName.trim(),
      voteCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    let requestId: string | null = null;

    // Optionally create song request for approval workflow
    if (createRequest) {
      try {
        const requestRef = adminDb.collection('songRequests').doc();
        await requestRef.set({
          eventId: eventId,
          songTitle: songTitle.trim(),
          artist: artist.trim(),
          guestName: guestName.trim(),
          status: 'pending',
          timestamp: Timestamp.now(),
          songId: songDocRef.id, // Link to the song in events/{eventId}/songs
        });
        requestId = requestRef.id;
      } catch (requestError) {
        // Non-critical error - log but don't fail the request
        console.error('Error creating song request (non-critical):', requestError);
      }
    }

    // Update invite usage stats
    await inviteRef.update({
      useCount: (inviteData.useCount || 0) + 1,
      lastUsedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      songId: songDocRef.id,
      requestId: requestId,
    });
  } catch (error: any) {
    console.error('Error submitting song suggestion:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit suggestion' },
      { status: 500 }
    );
  }
}
