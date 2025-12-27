'use client';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useAuth } from '../../../../contexts/AuthContext';
import { addSong, deleteSong, findSongByTitleAndArtist } from '../../../../lib/db/eventSongs';

interface Song {
  id: string;
  title: string;
  artist: string;
  subcollectionSongId?: string; // Store subcollection ID for deletion
}

export default function DoNotPlayPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const { currentUser } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSong, setNewSong] = useState({ title: '', artist: '' });
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadUserRole();
    }
  }, [currentUser]);

  useEffect(() => {
    loadDoNotPlayList();
  }, [eventId]);

  const loadUserRole = async () => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserRole(userSnap.data().role || 'client');
      } else {
        setUserRole('client');
      }
    } catch (error) {
      console.error('Error loading user role:', error);
      setUserRole('client');
    }
  };

  const loadDoNotPlayList = async () => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventRef);
      
      if (eventSnap.exists()) {
        const data = eventSnap.data();
        setSongs(data.doNotPlayList || []);
      }
    } catch (error) {
      console.error('Error loading do not play list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSong.title || !newSong.artist || !currentUser) return;
    
    try {
      const eventRef = doc(db, 'events', eventId);
      const songData: Song = {
        id: Date.now().toString(),
        title: newSong.title,
        artist: newSong.artist,
      };
      
      // Determine addedByType based on user role
      const addedByType = userRole === 'dj' ? 'dj' : userRole === 'admin' ? 'dj' : 'client';
      
      // Write to array first (primary source of truth in Phase 1)
      await updateDoc(eventRef, {
        doNotPlayList: arrayUnion(songData),
        updatedAt: Timestamp.now(),
      });
      
      // Dual-write to subcollection (additive, fire-and-forget if it fails)
      try {
        const subcollectionSongId = await addSong(eventId, {
          title: newSong.title,
          artist: newSong.artist,
          tag: 'do_not_play',
          addedByType: addedByType,
          addedByUserId: currentUser.uid,
        });
        
        // Update array song with subcollection ID for easier deletion later
        const songDataWithSubcollectionId: Song = {
          ...songData,
          subcollectionSongId: subcollectionSongId,
        };
        await updateDoc(eventRef, {
          doNotPlayList: arrayRemove(songData),
        });
        await updateDoc(eventRef, {
          doNotPlayList: arrayUnion(songDataWithSubcollectionId),
          updatedAt: Timestamp.now(),
        });
      } catch (subcollectionError) {
        // Log error but don't fail the operation (arrays are source of truth in Phase 1)
        console.error('Error writing to subcollection (non-critical):', subcollectionError);
      }
      
      setNewSong({ title: '', artist: '' });
      loadDoNotPlayList();
    } catch (error: any) {
      // If document doesn't exist, create it
      if (error.code === 'not-found') {
        const songData: Song = {
          id: Date.now().toString(),
          title: newSong.title,
          artist: newSong.artist,
        };
        
        const addedByType = userRole === 'dj' ? 'dj' : userRole === 'admin' ? 'dj' : 'client';
        
        await setDoc(doc(db, 'events', eventId), {
          doNotPlayList: [songData],
        });
        
        // Dual-write to subcollection
        try {
          const subcollectionSongId = await addSong(eventId, {
            title: newSong.title,
            artist: newSong.artist,
            tag: 'do_not_play',
            addedByType: addedByType,
            addedByUserId: currentUser?.uid,
          });
          
          // Update array with subcollection ID
          const songDataWithSubcollectionId: Song = {
            ...songData,
            subcollectionSongId: subcollectionSongId,
          };
          await updateDoc(doc(db, 'events', eventId), {
            doNotPlayList: [songDataWithSubcollectionId],
            updatedAt: Timestamp.now(),
          });
        } catch (subcollectionError) {
          console.error('Error writing to subcollection (non-critical):', subcollectionError);
        }
        
        setNewSong({ title: '', artist: '' });
        loadDoNotPlayList();
      } else {
        console.error('Error adding song:', error);
      }
    }
  };

  const handleRemoveSong = async (songToRemove: Song) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      
      // Remove from array first (primary source of truth)
      await updateDoc(eventRef, {
        doNotPlayList: arrayRemove(songToRemove),
        updatedAt: Timestamp.now(),
      });
      
      // Also delete from subcollection
      try {
        if (songToRemove.subcollectionSongId) {
          // Use stored subcollection ID if available
          await deleteSong(eventId, songToRemove.subcollectionSongId);
        } else {
          // Fallback: find song by title+artist+tag
          const subcollectionSong = await findSongByTitleAndArtist(
            eventId,
            songToRemove.title,
            songToRemove.artist,
            'do_not_play'
          );
          if (subcollectionSong) {
            await deleteSong(eventId, subcollectionSong.id);
          }
        }
      } catch (subcollectionError) {
        // Log error but don't fail the operation
        console.error('Error deleting from subcollection (non-critical):', subcollectionError);
      }
      
      loadDoNotPlayList();
    } catch (error) {
      console.error('Error removing song:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar></Navbar>
        
        <div className="container mx-auto px-4 py-12 flex-grow">
          <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl dark:text-white mb-6">
            Do Not Play List
          </h1>

          <DashboardNav eventId={eventId} />

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Add Song to Do Not Play List</h2>
                <form onSubmit={handleAddSong} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Song title"
                    value={newSong.title}
                    onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Artist"
                    value={newSong.artist}
                    onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Add
                  </button>
                </form>
              </div>

              <div className="space-y-2">
                {songs.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No songs in your do not play list yet.</p>
                  </div>
                ) : (
                  songs.map((song) => (
                    <div key={song.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-900">{song.title}</p>
                        <p className="text-sm text-gray-600">{song.artist}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveSong(song)}
                        className="text-red-600 hover:text-red-800 text-sm px-3 py-1 bg-red-50 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <Footer></Footer>
      </div>
    </ProtectedRoute>
  );
}

