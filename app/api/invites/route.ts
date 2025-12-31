import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';
import { verifyAuthToken, canAccessEvent } from '../../../lib/api-auth';
import { generateToken, hashToken } from '../../../lib/invites';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * POST /api/invites - Create a new invite
 * Requires authentication and event access
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { eventId, expiresAt, maxUses, metadata } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId is required' },
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

    // Generate token
    const token = generateToken();
    const tokenHash = hashToken(token);

    // Parse expiration
    let expiresAtTimestamp: Timestamp | null = null;
    if (expiresAt) {
      expiresAtTimestamp = Timestamp.fromDate(new Date(expiresAt));
    }

    // Create invite document
    const inviteRef = adminDb.collection('invites').doc();
    await inviteRef.set({
      eventId,
      tokenHash,
      createdBy: userId,
      createdAt: Timestamp.now(),
      expiresAt: expiresAtTimestamp,
      revoked: false,
      maxUses: maxUses ?? null,
      useCount: 0,
      lastUsedAt: null,
      metadata: metadata || {},
    });

    // Build invite URL
    const baseUrl = request.nextUrl.origin;
    const inviteUrl = `${baseUrl}/request-song/${eventId}?token=${token}`;

    return NextResponse.json({
      inviteId: inviteRef.id,
      token, // Returned only once
      inviteUrl,
      expiresAt: expiresAtTimestamp,
      maxUses: maxUses ?? null,
    });
  } catch (error: any) {
    console.error('Error creating invite:', error);
    return NextResponse.json(
      { error: 'Failed to create invite', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/invites?eventId=[eventId] - List invites for an event
 * Requires authentication and event access
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId is required' },
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

    // Get all invites for this event
    const invitesSnapshot = await adminDb
      .collection('invites')
      .where('eventId', '==', eventId)
      .get();

    const invites = invitesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        inviteId: doc.id,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
        revoked: data.revoked,
        useCount: data.useCount,
        maxUses: data.maxUses,
        lastUsedAt: data.lastUsedAt,
        createdBy: data.createdBy,
        metadata: data.metadata,
      };
    });

    return NextResponse.json({ invites });
  } catch (error: any) {
    console.error('Error listing invites:', error);
    return NextResponse.json(
      { error: 'Failed to list invites', message: error.message },
      { status: 500 }
    );
  }
}

