import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../../lib/firebase-admin';
import { verifyAuthToken, canAccessEvent } from '../../../../../lib/api-auth';

/**
 * POST /api/invites/[inviteId]/revoke - Revoke an invite
 * Requires authentication and event access
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { inviteId: string } }
) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const inviteId = params.inviteId;

    // Get invite to check event access
    const inviteRef = adminDb.collection('invites').doc(inviteId);
    const inviteDoc = await inviteRef.get();

    if (!inviteDoc.exists) {
      return NextResponse.json(
        { error: 'Invite not found' },
        { status: 404 }
      );
    }

    const inviteData = inviteDoc.data();
    const eventId = inviteData?.eventId;

    if (!eventId) {
      return NextResponse.json(
        { error: 'Invalid invite' },
        { status: 400 }
      );
    }

    // Verify user can access this event
    const hasAccess = await canAccessEvent(userId, eventId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'You do not have access to this event' },
        { status: 403 }
      );
    }

    // Revoke the invite
    await inviteRef.update({
      revoked: true,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error revoking invite:', error);
    return NextResponse.json(
      { error: 'Failed to revoke invite', message: error.message },
      { status: 500 }
    );
  }
}

