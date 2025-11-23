'use client';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

interface Song {
  id: string;
  title: string;
  artist: string;
}

export default function DoNotPlayPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSong, setNewSong] = useState({ title: '', artist: '' });

  useEffect(() => {
    loadDoNotPlayList();
  }, [eventId]);

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
    if (!newSong.title || !newSong.artist) return;
    
    try {
      const eventRef = doc(db, 'events', eventId);
      const songData: Song = {
        id: Date.now().toString(),
        title: newSong.title,
        artist: newSong.artist,
      };
      
      await updateDoc(eventRef, {
        doNotPlayList: arrayUnion(songData),
      });
      
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
        await setDoc(doc(db, 'events', eventId), {
          doNotPlayList: [songData],
        });
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
      await updateDoc(eventRef, {
        doNotPlayList: arrayRemove(songToRemove),
      });
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

