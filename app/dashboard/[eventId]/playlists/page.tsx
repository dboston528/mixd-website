'use client';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import SpotifyImport from '../../../../components/SpotifyImport';
import EventHero from '../../../../components/dashboard/EventHero';

interface Song {
  id: string;
  title: string;
  artist: string;
  spotifyId?: string;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  eventId: string;
}

export default function PlaylistsPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [songSearch, setSongSearch] = useState('');
  const [newSong, setNewSong] = useState({ title: '', artist: '' });

  useEffect(() => {
    loadPlaylists();
  }, [eventId]);

  const loadPlaylists = async () => {
    try {
      const playlistsRef = collection(db, 'playlists');
      const q = query(playlistsRef, where('eventId', '==', eventId));
      const querySnapshot = await getDocs(q);
      
      const playlistsData: Playlist[] = [];
      querySnapshot.forEach((doc) => {
        playlistsData.push({ id: doc.id, ...doc.data() } as Playlist);
      });
      
      setPlaylists(playlistsData);
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'playlists'), {
        name: newPlaylistName,
        eventId: eventId,
        songs: [],
        createdAt: new Date(),
      });
      setNewPlaylistName('');
      setShowCreateModal(false);
      loadPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleAddSong = async (playlistId: string) => {
    if (!newSong.title || !newSong.artist) return;
    
    try {
      const playlistRef = doc(db, 'playlists', playlistId);
      const playlist = playlists.find(p => p.id === playlistId);
      if (!playlist) return;
      
      const newSongData: Song = {
        id: Date.now().toString(),
        title: newSong.title,
        artist: newSong.artist,
      };
      
      await updateDoc(playlistRef, {
        songs: [...playlist.songs, newSongData],
      });
      
      setNewSong({ title: '', artist: '' });
      loadPlaylists();
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  const handleRemoveSong = async (playlistId: string, songId: string) => {
    try {
      const playlistRef = doc(db, 'playlists', playlistId);
      const playlist = playlists.find(p => p.id === playlistId);
      if (!playlist) return;
      
      await updateDoc(playlistRef, {
        songs: playlist.songs.filter(s => s.id !== songId),
      });
      
      loadPlaylists();
    } catch (error) {
      console.error('Error removing song:', error);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;
    
    try {
      await deleteDoc(doc(db, 'playlists', playlistId));
      loadPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar></Navbar>
        <EventHero eventId={eventId} />

        <div className="container mx-auto px-4 py-12 flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              Playlists
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <span>🎵</span>
                Import from Spotify
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                + New Playlist
              </button>
            </div>
          </div>

          <DashboardNav eventId={eventId} />

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600">Loading playlists...</p>
            </div>
          ) : playlists.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No playlists yet. Create your first playlist!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Create Playlist
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{playlist.name}</h3>
                    <button
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <div className="mb-4 space-y-2">
                    {playlist.songs.length === 0 ? (
                      <p className="text-gray-500 text-sm">No songs yet</p>
                    ) : (
                      playlist.songs.map((song) => (
                        <div key={song.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span className="text-gray-900">{song.title} - {song.artist}</span>
                          <button
                            onClick={() => handleRemoveSong(playlist.id, song.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Song title"
                        value={newSong.title}
                        onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      />
                      <input
                        type="text"
                        placeholder="Artist"
                        value={newSong.artist}
                        onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      />
                      <button
                        onClick={() => handleAddSong(playlist.id)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Add Song
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Create New Playlist</h2>
              <form onSubmit={handleCreatePlaylist} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Import from Spotify</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <SpotifyImport
                eventId={eventId}
                playlists={playlists.map(p => ({ id: p.id, name: p.name }))}
                onImportComplete={() => {
                  setShowImportModal(false);
                  loadPlaylists();
                }}
              />
            </div>
          </div>
        )}

        <Footer></Footer>
      </div>
    </ProtectedRoute>
  );
}

