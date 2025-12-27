import { Timestamp } from 'firebase/firestore';

export type EventStatus = 'draft' | 'in_progress' | 'finalized' | 'archived';

export interface Event {
  id: string;
  name: string;
  date: Timestamp;
  type: string;
  userId: string;
  assignedDJs?: string[];
  createdAt: Timestamp;
  // New optional fields
  status?: EventStatus;
  venueName?: string;
  updatedAt?: Timestamp;
}

