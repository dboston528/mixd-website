import { Timestamp } from 'firebase/firestore';

export interface Invite {
  id: string; // Document ID
  eventId: string;
  tokenHash: string; // SHA-256 hash for validation (stored, not plain token)
  createdBy: string; // userId of creator (event owner/DJ/admin)
  createdAt: Timestamp;
  expiresAt: Timestamp | null; // null = never expires
  revoked: boolean; // Can be revoked by creator
  maxUses: number | null; // null = unlimited uses
  useCount: number; // Track how many times used
  lastUsedAt: Timestamp | null;
  metadata?: {
    guestName?: string; // Optional: pre-fill guest name
    customMessage?: string; // Optional: custom invite message
  };
}

export interface CreateInviteInput {
  eventId: string;
  expiresAt?: string | null; // ISO date string, null = never expires
  maxUses?: number | null; // null = unlimited
  metadata?: {
    guestName?: string;
    customMessage?: string;
  };
}

export interface InviteResponse {
  inviteId: string;
  token: string; // Returned only once
  inviteUrl: string; // Full URL: /request-song/[eventId]?token=[token]
  expiresAt: Timestamp | null;
  maxUses: number | null;
}

