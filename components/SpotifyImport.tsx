'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, addDoc, collection, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SpotifyPlaylist {
  id: string;
  name: string;
  description?: string;
  image?: string;
  tracks: number;
  owner: string;
}

interface SpotifySong {
  id: string;
  title: string;
  artist: string;
  spotifyId: string;
  album?: string;
  duration?: number;
}

interface SpotifyImportProps {
  eventId: string;
  playlists: Array<{ id: string; name: string }>;
  onImportComplete: () => void;
}

export default function SpotifyImport({ eventId, playlists, onImportComplete }: SpotifyImportProps) {
  const { currentUser } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-playlists' | 'public'>('my-playlists');
  const [userPlaylists, setUserPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [publicPlaylistUrl, setPublicPlaylistUrl] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [targetPlaylist, setTargetPlaylist] = useState<'new' | string>('new');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState('');

  useEffect(() => {
    checkSpotifyConnection();
  }, [currentUser]);

  const fetchUserPlaylists = async (accessToken?: string) => {
    if (!currentUser) return;

    try {
      const token = accessToken || (await getValidAccessToken());
      if (!token) return;

      const playlistsResponse = await fetch(`/api/spotify/playlists?accessToken=${token}`);
      const playlistsData = await playlistsResponse.json();

      if (playlistsData.playlists) {
        setUserPlaylists(playlistsData.playlists as SpotifyPlaylist[]);
      } else {
        setUserPlaylists([]);
      }
    } catch (error) {
      console.error('Error fetching Spotify playlists:', error);
    }
  };

  const checkSpotifyConnection = async () => {
    if (!currentUser) {
      setIsConnected(false);
      setUserPlaylists([]);
      return;
    }

    setLoading(true);
    try {
      const accessToken = await getValidAccessToken();
      if (accessToken) {
        setIsConnected(true);
        await fetchUserPlaylists(accessToken);
      } else {
        setIsConnected(false);
        setUserPlaylists([]);
      }
    } catch (error) {
      console.error('Error checking Spotify connection:', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const getValidAccessToken = async (): Promise<string | null> => {
    if (!currentUser) return null;
    
    try {
      const tokensResponse = await fetch(`/api/spotify/tokens?userId=${currentUser.uid}`);
      const tokensData = await tokensResponse.json();
      
      if (!tokensData.tokens) {
        return null;
      }
      
      let accessToken = tokensData.tokens.accessToken;
      
      // Check if token needs refresh
      if (tokensData.tokens.expiresAt) {
        let expiresAt: number;
        if (typeof tokensData.tokens.expiresAt === 'object' && tokensData.tokens.expiresAt.toMillis) {
          expiresAt = tokensData.tokens.expiresAt.toMillis();
        } else if (typeof tokensData.tokens.expiresAt === 'object' && tokensData.tokens.expiresAt._seconds) {
          expiresAt = tokensData.tokens.expiresAt._seconds * 1000;
        } else {
          expiresAt = tokensData.tokens.expiresAt;
        }
        
        if (Date.now() >= expiresAt - 60000) { // Refresh if expires in less than 1 minute
          try {
            const refreshResponse = await fetch('/api/spotify/refresh', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: currentUser.uid }),
            });
            const refreshData = await refreshResponse.json();
            if (refreshData.accessToken) {
              accessToken = refreshData.accessToken;
            }
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
          }
        }
      }
      
      return accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  const handleConnectSpotify = async () => {
    if (!currentUser) {
      alert('Please sign in to connect Spotify');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/spotify/auth?userId=${currentUser.uid}`);
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error('Missing Spotify auth URL');
      }
    } catch (error: any) {
      console.error('Error connecting to Spotify:', error);
      alert(`Unable to start Spotify connection: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'spotifyTokens', 'tokens'));
      setIsConnected(false);
      setUserPlaylists([]);
      setSelectedPlaylist(null);
      setTargetPlaylist('new');
      setNewPlaylistName('');
    } catch (error) {
      console.error('Error disconnecting Spotify:', error);
      alert('Could not disconnect Spotify. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportFromMyPlaylist = async (playlistId: string) => {
    if (!currentUser) return;
    
    setImporting(true);
    setImportProgress('Fetching playlist...');
    
    try {
      const accessToken = await getValidAccessToken();
      
      if (!accessToken) {
        alert('Please connect your Spotify account first');
        setImporting(false);
        return;
      }
      
      // Get playlist tracks
      const playlistResponse = await fetch(
        `/api/spotify/playlist/${playlistId}?accessToken=${accessToken}`
      );
      const playlistData = await playlistResponse.json();
      
      if (playlistData.error) {
        throw new Error(playlistData.error);
      }
      
      if (!playlistData.songs || playlistData.songs.length === 0) {
        alert('No songs found in this playlist');
        setImporting(false);
        return;
      }
      
      await importSongs(playlistData.songs, playlistData.playlist.name);
    } catch (error: any) {
      console.error('Error importing playlist:', error);
      alert(`Error importing playlist: ${error.message || 'Unknown error'}`);
      setImporting(false);
    }
  };

  const handleImportFromPublic = async () => {
    if (!publicPlaylistUrl.trim()) {
      alert('Please enter a Spotify playlist URL or ID');
      return;
    }
    
    if (!currentUser) return;
    
    setImporting(true);
    setImportProgress('Fetching public playlist...');
    
    try {
      // Get access token (needed even for public playlists)
      const accessToken = await getValidAccessToken();
      
      if (!accessToken) {
        alert('Please connect your Spotify account first');
        setImporting(false);
        return;
      }
      
      // Extract playlist ID from URL
      const playlistId = encodeURIComponent(publicPlaylistUrl.trim());
      
      // Get playlist tracks
      const playlistResponse = await fetch(
        `/api/spotify/public/${playlistId}?accessToken=${accessToken}`
      );
      const playlistData = await playlistResponse.json();
      
      if (playlistData.error) {
        throw new Error(playlistData.error);
      }
      
      if (!playlistData.songs || playlistData.songs.length === 0) {
        alert('No songs found in this playlist');
        setImporting(false);
        return;
      }
      
      await importSongs(playlistData.songs, playlistData.playlist.name);
    } catch (error: any) {
      console.error('Error importing public playlist:', error);
      alert(`Error importing playlist: ${error.message || 'Unknown error'}`);
      setImporting(false);
    }
  };

  const importSongs = async (songs: SpotifySong[], sourcePlaylistName: string) => {
    if (!currentUser) return;
    
    setImportProgress(`Importing ${songs.length} songs...`);
    
    try {
      const convertedSongs = songs.map((song) => ({
        id: song.spotifyId || Date.now().toString() + Math.random(),
        title: song.title,
        artist: song.artist,
        spotifyId: song.spotifyId,
      }));
      
      if (targetPlaylist === 'new') {
        // Create new playlist
        const playlistName = newPlaylistName || `${sourcePlaylistName} (Imported)`;
        
        await addDoc(collection(db, 'playlists'), {
          name: playlistName,
          eventId: eventId,
          songs: convertedSongs,
          createdAt: new Date(),
        });
      } else {
        // Add to existing playlist
        const playlistRef = doc(db, 'playlists', targetPlaylist);
        const playlistSnap = await getDoc(playlistRef);
        
        if (playlistSnap.exists()) {
          const existingSongs = playlistSnap.data().songs || [];
          await updateDoc(playlistRef, {
            songs: [...existingSongs, ...convertedSongs],
          });
        }
      }
      
      setImportProgress('Import complete!');
      setTimeout(() => {
        onImportComplete();
        setImporting(false);
        setPublicPlaylistUrl('');
        setNewPlaylistName('');
        setTargetPlaylist('new');
      }, 1000);
    } catch (error: any) {
      console.error('Error saving songs:', error);
      alert(`Error saving songs: ${error.message}`);
      setImporting(false);
    }
  };

  // Handle callback from Spotify OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const spotifySuccess = urlParams.get('spotify_success');
    const spotifyError = urlParams.get('spotify_error');
    
    if (spotifySuccess) {
      // Tokens already stored by callback route, just refresh connection status
      checkSpotifyConnection();
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (spotifyError) {
      alert(`Spotify connection error: ${spotifyError}`);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [currentUser]);

  return (
    <div className="space-y-4">
      {!isConnected ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-4">Connect your Spotify account to import playlists</p>
          <button
            onClick={handleConnectSpotify}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Connect Spotify
          </button>
        </div>
      ) : (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-green-800 font-medium">Spotify Connected</span>
            </div>
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="text-sm text-green-600 hover:text-green-800 disabled:text-green-400 disabled:cursor-not-allowed"
            >
              Disconnect
            </button>
          </div>

          {!importing ? (
            <>
              {/* Tabs */}
              <div className="flex gap-2 border-b">
                <button
                  onClick={() => setActiveTab('my-playlists')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'my-playlists'
                      ? 'border-b-2 border-teal-600 text-teal-600'
                      : 'text-gray-600'
                  }`}
                >
                  My Playlists
                </button>
                <button
                  onClick={() => setActiveTab('public')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'public'
                      ? 'border-b-2 border-teal-600 text-teal-600'
                      : 'text-gray-600'
                  }`}
                >
                  Public Playlist
                </button>
              </div>

              {/* My Playlists Tab */}
              {activeTab === 'my-playlists' && (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Select Playlist
                    </label>
                    <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg">
                      {userPlaylists.length === 0 ? (
                        <p className="p-4 text-gray-500 text-center">No playlists found</p>
                      ) : (
                        userPlaylists.map((playlist) => (
                          <button
                            key={playlist.id}
                            onClick={() => setSelectedPlaylist(playlist.id)}
                            className={`w-full text-left p-3 border-b last:border-b-0 hover:bg-gray-50 ${
                              selectedPlaylist === playlist.id ? 'bg-teal-50 border-teal-200' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {playlist.image && (
                                <img
                                  src={playlist.image}
                                  alt={playlist.name}
                                  className="w-12 h-12 rounded"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{playlist.name}</p>
                                <p className="text-sm text-gray-500">
                                  {playlist.tracks} tracks • {playlist.owner}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {selectedPlaylist && (
                    <>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                          Import to
                        </label>
                        <select
                          value={targetPlaylist}
                          onChange={(e) => setTargetPlaylist(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="new">Create New Playlist</option>
                          {playlists.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {targetPlaylist === 'new' && (
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-900">
                            New Playlist Name
                          </label>
                          <input
                            type="text"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            placeholder="Playlist name (optional)"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                      )}

                      <button
                        onClick={() => handleImportFromMyPlaylist(selectedPlaylist)}
                        className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Import Playlist
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Public Playlist Tab */}
              {activeTab === 'public' && (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Spotify Playlist URL or ID
                    </label>
                    <input
                      type="text"
                      value={publicPlaylistUrl}
                      onChange={(e) => setPublicPlaylistUrl(e.target.value)}
                      placeholder="https://open.spotify.com/playlist/... or playlist ID"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Paste a Spotify playlist URL or playlist ID
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Import to
                    </label>
                    <select
                      value={targetPlaylist}
                      onChange={(e) => setTargetPlaylist(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="new">Create New Playlist</option>
                      {playlists.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {targetPlaylist === 'new' && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        New Playlist Name
                      </label>
                      <input
                        type="text"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="Playlist name (optional)"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleImportFromPublic}
                    disabled={!publicPlaylistUrl.trim()}
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Import Playlist
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-4"></div>
              <p className="text-gray-600">{importProgress}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
