import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../../lib/firebase-admin';
import { hashToken, validateTokenHash } from '../../../../../lib/invites';

/**
 * GET /api/invites/validate?token=[token] - Validate an invite token
 * Public endpoint (no auth required)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
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
      return NextResponse.json({
        valid: false,
        error: 'Invalid token',
      });
    }

    const inviteDoc = invitesSnapshot.docs[0];
    const inviteData = inviteDoc.data();

    // Check if revoked
    if (inviteData.revoked) {
      return NextResponse.json({
        valid: false,
        revoked: true,
        error: 'This invite has been revoked',
      });
    }

    // Check if expired
    const now = new Date();
    if (inviteData.expiresAt) {
      const expiresAt = inviteData.expiresAt.toDate();
      if (expiresAt < now) {
        return NextResponse.json({
          valid: false,
          error: 'This invite has expired',
        });
      }
    }

    // Check if max uses reached
    if (inviteData.maxUses !== null && inviteData.useCount >= inviteData.maxUses) {
      return NextResponse.json({
        valid: false,
        error: 'This invite has reached its maximum number of uses',
      });
    }

    // Get event name for display
    let eventName = '';
    try {
      const eventDoc = await adminDb.collection('events').doc(inviteData.eventId).get();
      if (eventDoc.exists) {
        eventName = eventDoc.data()?.name || '';
      }
    } catch (error) {
      // Non-critical, continue
    }

    // Calculate remaining uses
    const remainingUses = inviteData.maxUses !== null
      ? Math.max(0, inviteData.maxUses - inviteData.useCount)
      : null;

    return NextResponse.json({
      valid: true,
      eventId: inviteData.eventId,
      eventName,
      expiresAt: inviteData.expiresAt,
      remainingUses,
      revoked: false,
    });
  } catch (error: any) {
    console.error('Error validating token:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate token' },
      { status: 500 }
    );
  }
}

