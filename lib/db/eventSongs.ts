import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  EventSong,
  CreateEventSongInput,
  UpdateEventSongInput,
  ListSongsOptions,
} from '../../types/eventSongs';

/**
 * Add a new song to an event
 */
export async function addSong(
  eventId: string,
  songInput: CreateEventSongInput
): Promise<string> {
  const songsRef = collection(db, 'events', eventId, 'songs');
  
  const songData = {
    title: songInput.title,
    artist: songInput.artist,
    tag: songInput.tag || 'neutral',
    sourceType: songInput.sourceType || 'manual',
    sourceId: songInput.sourceId,
    sourceUrl: songInput.sourceUrl,
    notes: songInput.notes,
    addedByType: songInput.addedByType,
    addedByUserId: songInput.addedByUserId,
    addedByGuestName: songInput.addedByGuestName,
    voteCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(songsRef, songData);
  return docRef.id;
}

/**
 * Update an existing song
 */
export async function updateSong(
  eventId: string,
  songId: string,
  patch: UpdateEventSongInput
): Promise<void> {
  const songRef = doc(db, 'events', eventId, 'songs', songId);
  
  const updateData = {
    ...patch,
    updatedAt: Timestamp.now(),
  };

  await updateDoc(songRef, updateData);
}

/**
 * Delete a song from an event
 */
export async function deleteSong(
  eventId: string,
  songId: string
): Promise<void> {
  const songRef = doc(db, 'events', eventId, 'songs', songId);
  await deleteDoc(songRef);
}

/**
 * List songs for an event with optional filtering and sorting
 */
export async function listSongs(
  eventId: string,
  options: ListSongsOptions = {}
): Promise<EventSong[]> {
  const songsRef = collection(db, 'events', eventId, 'songs');
  
  const constraints: QueryConstraint[] = [];

  // Add tag filter if specified
  if (options.tag) {
    constraints.push(where('tag', '==', options.tag));
  }

  // Add sorting
  const sortField = options.sortBy || 'createdAt';
  const sortDir = options.sortDirection || 'desc';
  constraints.push(orderBy(sortField, sortDir));

  const q = query(songsRef, ...constraints);
  const querySnapshot = await getDocs(q);

  const songs: EventSong[] = [];
  querySnapshot.forEach((doc) => {
    songs.push({
      id: doc.id,
      ...doc.data(),
    } as EventSong);
  });

  return songs;
}

/**
 * Get a single song by ID
 */
export async function getSong(
  eventId: string,
  songId: string
): Promise<EventSong | null> {
  const songRef = doc(db, 'events', eventId, 'songs', songId);
  const songSnap = await getDoc(songRef);
  
  if (!songSnap.exists()) {
    return null;
  }

  return {
    id: songSnap.id,
    ...songSnap.data(),
  } as EventSong;
}

