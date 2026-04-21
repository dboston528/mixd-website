'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MdAdd, MdSearch, MdClose } from 'react-icons/md';
import { SiSpotify } from 'react-icons/si';
import { HiPlay, HiPause, HiExternalLink } from 'react-icons/hi';

interface SpotifyTrack {
  spotifyId: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string | null;
  previewUrl: string | null;
  spotifyUrl: string | null;
}

interface Props {
  onSelectSong: (song: { title: string; artist: string; spotifyId: string; previewUrl?: string | null; spotifyUrl?: string | null }) => void;
  onClose: () => void;
  dark: boolean;
}

export default function SpotifySearchPanel({ onSelectSong, onClose, dark }: Props) {
  const { currentUser } = useAuth();
  const [connected, setConnected] = useState<boolean | null>(null); // null = loading
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [searching, setSearching] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [connectingSpotify, setConnectingSpotify] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Audio preview
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePreview = (track: SpotifyTrack) => {
    if (!track.previewUrl) return;
    if (playingId === track.spotifyId) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      const audio = new Audio(track.previewUrl);
      audio.play();
      audio.onended = () => setPlayingId(null);
      audioRef.current = audio;
      setPlayingId(track.spotifyId);
    }
  };

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  // ── Token helpers (mirrors SpotifyImport logic) ──────────────────────────

  const getValidAccessToken = useCallback(async (): Promise<string | null> => {
    if (!currentUser) return null;
    try {
      const res = await fetch(`/api/spotify/tokens?userId=${currentUser.uid}`);
      const data = await res.json();
      if (!data.tokens) return null;

      let token = data.tokens.accessToken;

      // Refresh if close to expiry
      if (data.tokens.expiresAt) {
        let expiresAt: number;
        const ea = data.tokens.expiresAt;
        if (ea?.toMillis) expiresAt = ea.toMillis();
        else if (ea?._seconds) expiresAt = ea._seconds * 1000;
        else expiresAt = ea;

        if (Date.now() >= expiresAt - 60000) {
          const refreshRes = await fetch('/api/spotify/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.uid }),
          });
          const refreshData = await refreshRes.json();
          if (refreshData.accessToken) token = refreshData.accessToken;
        }
      }
      return token;
    } catch {
      return null;
    }
  }, [currentUser]);

  // ── Check connection on mount ─────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      const token = await getValidAccessToken();
      setConnected(!!token);
      if (token) setTimeout(() => inputRef.current?.focus(), 50);
    })();
  }, [getValidAccessToken]);

  // ── Search with debounce ──────────────────────────────────────────────────

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { doSearch(query); }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const doSearch = async (q: string) => {
    setSearching(true);
    try {
      const token = await getValidAccessToken();
      if (!token) { setConnected(false); setSearching(false); return; }
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(q)}&accessToken=${token}`);
      const data = await res.json();
      setResults(data.tracks || []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  // ── Connect Spotify ───────────────────────────────────────────────────────

  const handleConnect = async () => {
    if (!currentUser) return;
    setConnectingSpotify(true);
    try {
      const res = await fetch(`/api/spotify/auth?userId=${currentUser.uid}`);
      const data = await res.json();
      if (data.authUrl) window.location.href = data.authUrl;
    } catch {
      setConnectingSpotify(false);
    }
  };

  // ── Add song ──────────────────────────────────────────────────────────────

  const handleAdd = (track: SpotifyTrack) => {
    // Stop preview if this track is playing when added
    if (playingId === track.spotifyId) { audioRef.current?.pause(); setPlayingId(null); }
    onSelectSong({
      title: track.title,
      artist: track.artist,
      spotifyId: track.spotifyId,
      previewUrl: track.previewUrl,
      spotifyUrl: track.spotifyUrl,
    });
    setAddedIds(prev => new Set(Array.from(prev).concat([track.spotifyId])));
  };

  // ── Theme ─────────────────────────────────────────────────────────────────

  const panelBg   = dark ? 'bg-slate-800 border-slate-700'  : 'bg-white border-gray-200';
  const inputCls  = dark
    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-green-500'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500';
  const subText   = dark ? 'text-slate-400'     : 'text-gray-500';
  const headerTxt = dark ? 'text-white'         : 'text-gray-900';
  const rowHover  = dark ? 'hover:bg-slate-700' : 'hover:bg-gray-50';
  const divider   = dark ? 'border-slate-700'   : 'border-gray-100';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={`rounded-2xl border mt-2 overflow-hidden ${panelBg}`}>

      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${divider}`}>
        <div className="flex items-center gap-2">
          <SiSpotify className="w-4 h-4 text-green-500" />
          <span className={`text-sm font-semibold ${headerTxt}`}>Search Spotify</span>
        </div>
        <button onClick={onClose} className={`p-1 rounded-lg transition-colors ${dark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-400'}`}>
          <MdClose className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3">

        {/* Loading connection status */}
        {connected === null && (
          <div className="flex justify-center py-6">
            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Not connected */}
        {connected === false && (
          <div className="text-center py-6 space-y-3">
            <SiSpotify className="w-10 h-10 text-green-500 mx-auto" />
            <p className={`text-sm ${subText}`}>Connect Spotify to search and add tracks directly</p>
            <button
              onClick={handleConnect}
              disabled={connectingSpotify}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <SiSpotify className="w-4 h-4" />
              {connectingSpotify ? 'Connecting...' : 'Connect Spotify'}
            </button>
          </div>
        )}

        {/* Connected — show search */}
        {connected === true && (
          <>
            {/* Search input */}
            <div className="relative mb-3">
              <MdSearch className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${subText}`} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search songs, artists, albums..."
                className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none transition-colors ${inputCls}`}
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setResults([]); }}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${subText} hover:text-gray-600`}
                >
                  <MdClose className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Spinner */}
            {searching && (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Empty query prompt */}
            {!searching && !query && (
              <p className={`text-xs text-center py-3 ${subText}`}>Type a song or artist name to search</p>
            )}

            {/* No results */}
            {!searching && query && results.length === 0 && (
              <p className={`text-xs text-center py-3 ${subText}`}>No results for "{query}"</p>
            )}

            {/* Results */}
            {!searching && results.length > 0 && (
              <div className={`rounded-xl border overflow-hidden divide-y ${dark ? 'border-slate-700 divide-slate-700' : 'border-gray-100 divide-gray-100'}`}>
                {results.map(track => {
                  const added = addedIds.has(track.spotifyId);
                  const isPlaying = playingId === track.spotifyId;
                  return (
                    <div key={track.spotifyId} className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${rowHover}`}>

                      {/* Play / Album art */}
                      <div className="relative flex-shrink-0 w-10 h-10">
                        {track.albumArt ? (
                          <img src={track.albumArt} alt={track.album} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                            <SiSpotify className="w-5 h-5 text-green-500" />
                          </div>
                        )}
                        {track.previewUrl && (
                          <button
                            onClick={() => togglePreview(track)}
                            title={isPlaying ? 'Pause' : 'Preview 30s'}
                            className={`absolute inset-0 rounded-lg flex items-center justify-center transition-all ${
                              isPlaying
                                ? 'bg-black/70'
                                : 'bg-black/0 hover:bg-black/50'
                            }`}
                          >
                            {isPlaying
                              ? <HiPause className="w-5 h-5 text-white" />
                              : <HiPlay className="w-5 h-5 text-white opacity-0 hover:opacity-100 ml-0.5" />
                            }
                          </button>
                        )}
                      </div>

                      {/* Track info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${headerTxt}`}>{track.title}</p>
                        <p className={`text-xs truncate ${subText}`}>{track.artist}
                          {track.previewUrl && (
                            <span className={`ml-1.5 text-xs ${dark ? 'text-slate-500' : 'text-gray-400'}`}>· preview available</span>
                          )}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {track.spotifyUrl && (
                          <a
                            href={track.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open in Spotify"
                            className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-slate-400 hover:text-green-400 hover:bg-slate-700' : 'text-gray-400 hover:text-green-600 hover:bg-gray-100'}`}
                          >
                            <HiExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleAdd(track)}
                          disabled={added}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            added
                              ? dark ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-600'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {added ? '✓ Added' : <><MdAdd className="w-3.5 h-3.5" />Add</>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
