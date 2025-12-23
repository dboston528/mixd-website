import { Timestamp } from 'firebase/firestore';

export type SongTag = 'must_play' | 'play_if_possible' | 'do_not_play' | 'neutral';
export type SongSourceType = 'spotify' | 'apple_music' | 'youtube' | 'manual';
export type AddedByType = 'dj' | 'client' | 'guest';

export interface EventSong {
  id: string;
  title: string;
  artist: string;
  tag: SongTag;
  sourceType: SongSourceType;
  sourceId?: string;
  sourceUrl?: string;
  notes?: string;
  addedByType: AddedByType;
  addedByUserId?: string;
  addedByGuestName?: string;
  voteCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateEventSongInput {
  title: string;
  artist: string;
  tag?: SongTag;
  sourceType?: SongSourceType;
  sourceId?: string;
  sourceUrl?: string;
  notes?: string;
  addedByType: AddedByType;
  addedByUserId?: string;
  addedByGuestName?: string;
}

export interface UpdateEventSongInput {
  title?: string;
  artist?: string;
  tag?: SongTag;
  sourceType?: SongSourceType;
  sourceId?: string;
  sourceUrl?: string;
  notes?: string;
  voteCount?: number;
}

export interface ListSongsOptions {
  tag?: SongTag;
  sortBy?: 'createdAt' | 'title' | 'voteCount';
  sortDirection?: 'asc' | 'desc';
}

