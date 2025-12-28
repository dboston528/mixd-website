import { NextRequest } from 'next/server';
import { adminAuth, adminDb } from './firebase-admin';

/**
 * Verify Firebase Auth token from request headers
 * Returns userId if valid, null otherwise
 */
export async function verifyAuthToken(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    return null;
  }
}

/**
 * Check if user can access an event (owner, assigned DJ, admin, or event member)
 */
export async function canAccessEvent(userId: string, eventId: string): Promise<boolean> {
  try {
    // Get user role
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) return false;
    
    const userRole = userDoc.data()?.role;
    if (userRole === 'admin') return true;

    // Get event
    const eventDoc = await adminDb.collection('events').doc(eventId).get();
    if (!eventDoc.exists) return false;

    const eventData = eventDoc.data();
    
    // Check if user is owner
    if (eventData?.userId === userId) return true;

    // Check if user is assigned DJ
    if (userRole === 'dj' && eventData?.assignedDJs?.includes(userId)) {
      return true;
    }

    // Check if user is event member
    const memberDocId = `${userId}_${eventId}`;
    const memberDoc = await adminDb.collection('eventMembers').doc(memberDocId).get();
    if (memberDoc.exists) return true;

    return false;
  } catch (error) {
    console.error('Error checking event access:', error);
    return false;
  }
}

