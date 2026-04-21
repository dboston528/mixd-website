'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import Navbar from '../../../components/navbar';
import {
  collection, query, where, getDocs, addDoc, updateDoc,
  deleteDoc, doc, Timestamp, writeBatch,
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { MdDragIndicator, MdAdd, MdDelete, MdEdit, MdClose, MdMusicNote } from 'react-icons/md';
import { HiChevronDown, HiChevronUp, HiSun, HiMoon, HiPlay, HiPause } from 'react-icons/hi';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import { SiSpotify } from 'react-icons/si';
import SpotifySearchPanel from '../../../../components/SpotifySearchPanel';
import EventHero from '../../../../components/dashboard/EventHero';

// ── Types ────────────────────────────────────────────────────────────────────

interface Song {
  id: string;
  title: string;
  artist: string;
  previewUrl?: string;
  spotifyUrl?: string;
}

interface SubSection {
  id: string;
  time: string;
  title: string;
  description: string;
  songs: Song[];
  order: number;
}

interface Section {
  id: string;
  time: string;
  title: string;
  description: string;
  songs: Song[];
  order: number;
  children: SubSection[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const SECTION_ICONS: Record<string, string> = {
  ceremony: '💍', cocktail: '🥂', reception: '🎉', dinner: '🍽️',
  dance: '💃', first: '✨', cake: '🎂', toast: '🥂', entrance: '🚪',
  exit: '🎊', photo: '📷', blessing: '🙏', grand: '🎊', bouquet: '💐',
  garter: '😄', prayer: '🙏', intro: '🎙️', open: '🎵',
};

function getIcon(title: string) {
  const lower = title.toLowerCase();
  for (const [key, icon] of Object.entries(SECTION_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '🎵';
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function TimelineMusicPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  // Dark mode
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('mixd-dark-mode');
    if (stored !== null) setDark(stored === 'true');
  }, []);
  const toggleDark = () => setDark(prev => {
    localStorage.setItem('mixd-dark-mode', String(!prev));
    return !prev;
  });

  // Data
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  // Expanded state — track both section IDs and "sectionId/subId" keys
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Parent drag state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Sub-section drag state
  const [draggingSubKey, setDraggingSubKey] = useState<string | null>(null); // "parentId/subId"
  const [dragOverSubKey, setDragOverSubKey] = useState<string | null>(null);

  // Modal state
  const [modal, setModal] = useState<{
    open: boolean;
    parentId: string | null; // null = creating/editing a parent section
    editing: Section | SubSection | null;
  }>({ open: false, parentId: null, editing: null });
  const [form, setForm] = useState({ time: '', title: '', description: '' });

  // Song inputs keyed by "sectionId" or "sectionId/subId"
  const [songInputs, setSongInputs] = useState<Record<string, { title: string; artist: string }>>({});

  // Which key currently has the Spotify search panel open (only one at a time)
  const [spotifyOpenKey, setSpotifyOpenKey] = useState<string | null>(null);

  const toggleSpotify = (key: string) =>
    setSpotifyOpenKey(prev => (prev === key ? null : key));

  // ── Audio preview ──────────────────────────────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePreview = (song: Song) => {
    if (!song.previewUrl) return;
    if (playingId === song.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      const audio = new Audio(song.previewUrl);
      audio.play();
      audio.onended = () => setPlayingId(null);
      audioRef.current = audio;
      setPlayingId(song.id);
    }
  };

  // Stop audio when unmounting
  useEffect(() => () => { audioRef.current?.pause(); }, []);

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => { load(); }, [eventId]);

  const load = async () => {
    try {
      const snap = await getDocs(query(
        collection(db, 'timelineItems'),
        where('eventId', '==', eventId),
      ));
      const data: Section[] = snap.docs.map(d => {
        const r = d.data();
        return {
          id: d.id,
          time: r.time ?? '',
          title: r.title ?? '',
          description: r.description ?? '',
          songs: r.songs ?? [],
          order: r.order ?? 0,
          children: (r.children ?? []).sort((a: SubSection, b: SubSection) => a.order - b.order),
        };
      }).sort((a, b) => a.order - b.order);
      setSections(data);
      // Expand everything by default
      const ids = new Set<string>();
      data.forEach(s => {
        ids.add(s.id);
        s.children.forEach(c => ids.add(`${s.id}/${c.id}`));
      });
      setExpandedIds(ids);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ── Expand toggle ─────────────────────────────────────────────────────────

  const toggle = (key: string) => setExpandedIds(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  // ── Modal helpers ─────────────────────────────────────────────────────────

  const openCreate = (parentId: string | null = null) => {
    setModal({ open: true, parentId, editing: null });
    setForm({ time: '', title: '', description: '' });
  };

  const openEdit = (item: Section | SubSection, parentId: string | null = null) => {
    setModal({ open: true, parentId, editing: item });
    setForm({ time: item.time, title: item.title, description: item.description });
  };

  const closeModal = () => setModal({ open: false, parentId: null, editing: null });

  // ── Section / sub-section CRUD ────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { parentId, editing } = modal;

    try {
      if (!parentId) {
        // ── Parent section ──────────────────────────────────────────────────
        if (editing) {
          await updateDoc(doc(db, 'timelineItems', editing.id), {
            time: form.time, title: form.title, description: form.description,
          });
        } else {
          const ref = await addDoc(collection(db, 'timelineItems'), {
            eventId, time: form.time, title: form.title,
            description: form.description, songs: [], children: [],
            order: sections.length, createdAt: Timestamp.now(),
          });
          setExpandedIds(prev => new Set(Array.from(prev).concat([ref.id])));
        }
      } else {
        // ── Sub-section ─────────────────────────────────────────────────────
        const parent = sections.find(s => s.id === parentId);
        if (!parent) return;

        let updatedChildren: SubSection[];
        if (editing) {
          updatedChildren = parent.children.map(c =>
            c.id === editing.id
              ? { ...c, time: form.time, title: form.title, description: form.description }
              : c
          );
        } else {
          const newSub: SubSection = {
            id: uid(), time: form.time, title: form.title,
            description: form.description, songs: [], order: parent.children.length,
          };
          updatedChildren = [...parent.children, newSub];
          setExpandedIds(prev => new Set(Array.from(prev).concat([`${parentId}/${newSub.id}`])));
        }
        await updateDoc(doc(db, 'timelineItems', parentId), { children: updatedChildren });
      }
      closeModal();
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Delete this section and all its contents?')) return;
    try {
      await deleteDoc(doc(db, 'timelineItems', id));
      load();
    } catch (e) { console.error(e); }
  };

  const handleDeleteSub = async (parentId: string, subId: string) => {
    if (!confirm('Delete this sub-section and its songs?')) return;
    const parent = sections.find(s => s.id === parentId);
    if (!parent) return;
    try {
      await updateDoc(doc(db, 'timelineItems', parentId), {
        children: parent.children.filter(c => c.id !== subId),
      });
      load();
    } catch (e) { console.error(e); }
  };

  // ── Song CRUD ─────────────────────────────────────────────────────────────

  // key = sectionId  OR  "sectionId/subId"
  const handleAddSong = async (key: string) => {
    const input = songInputs[key];
    if (!input?.title?.trim() || !input?.artist?.trim()) return;
    const newSong: Song = { id: uid(), title: input.title.trim(), artist: input.artist.trim() };
    const parts = key.split('/');

    try {
      if (parts.length === 1) {
        // Parent-level song
        const section = sections.find(s => s.id === key);
        if (!section) return;
        await updateDoc(doc(db, 'timelineItems', key), {
          songs: [...(section.songs || []), newSong],
        });
      } else {
        // Sub-section song
        const [parentId, subId] = parts;
        const parent = sections.find(s => s.id === parentId);
        if (!parent) return;
        const updatedChildren = parent.children.map(c =>
          c.id === subId ? { ...c, songs: [...(c.songs || []), newSong] } : c
        );
        await updateDoc(doc(db, 'timelineItems', parentId), { children: updatedChildren });
      }
      setSongInputs(prev => ({ ...prev, [key]: { title: '', artist: '' } }));
      load();
    } catch (e) { console.error(e); }
  };

  const handleRemoveSong = async (key: string, songId: string) => {
    const parts = key.split('/');
    try {
      if (parts.length === 1) {
        const section = sections.find(s => s.id === key);
        if (!section) return;
        await updateDoc(doc(db, 'timelineItems', key), {
          songs: section.songs.filter(s => s.id !== songId),
        });
      } else {
        const [parentId, subId] = parts;
        const parent = sections.find(s => s.id === parentId);
        if (!parent) return;
        const updatedChildren = parent.children.map(c =>
          c.id === subId ? { ...c, songs: c.songs.filter(s => s.id !== songId) } : c
        );
        await updateDoc(doc(db, 'timelineItems', parentId), { children: updatedChildren });
      }
      load();
    } catch (e) { console.error(e); }
  };

  // ── Parent drag & drop ────────────────────────────────────────────────────

  const onParentDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const onParentDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== dragOverId) setDragOverId(id);
  };
  const onParentDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) { setDraggingId(null); setDragOverId(null); return; }
    const updated = [...sections];
    const from = updated.findIndex(s => s.id === draggingId);
    const to = updated.findIndex(s => s.id === targetId);
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    const reordered = updated.map((s, i) => ({ ...s, order: i }));
    setSections(reordered);
    const batch = writeBatch(db);
    reordered.forEach(s => batch.update(doc(db, 'timelineItems', s.id), { order: s.order }));
    await batch.commit();
    setDraggingId(null); setDragOverId(null);
  };

  // ── Sub-section drag & drop ───────────────────────────────────────────────

  const onSubDragStart = (e: React.DragEvent, parentId: string, subId: string) => {
    e.stopPropagation();
    setDraggingSubKey(`${parentId}/${subId}`);
    e.dataTransfer.effectAllowed = 'move';
  };
  const onSubDragOver = (e: React.DragEvent, parentId: string, subId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const key = `${parentId}/${subId}`;
    if (key !== dragOverSubKey) setDragOverSubKey(key);
  };
  const onSubDrop = async (e: React.DragEvent, parentId: string, targetSubId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggingSubKey) return;
    const [dragParentId, dragSubId] = draggingSubKey.split('/');
    if (dragParentId !== parentId || dragSubId === targetSubId) {
      setDraggingSubKey(null); setDragOverSubKey(null); return;
    }
    const parent = sections.find(s => s.id === parentId);
    if (!parent) return;
    const updated = [...parent.children];
    const from = updated.findIndex(c => c.id === dragSubId);
    const to = updated.findIndex(c => c.id === targetSubId);
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    const reordered = updated.map((c, i) => ({ ...c, order: i }));
    await updateDoc(doc(db, 'timelineItems', parentId), { children: reordered });
    setDraggingSubKey(null); setDragOverSubKey(null);
    load();
  };

  // ── Theme ─────────────────────────────────────────────────────────────────

  const d = dark;
  const bg          = d ? 'bg-slate-900'                              : 'bg-gray-50';
  const headerText  = d ? 'text-white'                                : 'text-gray-900';
  const subText     = d ? 'text-slate-400'                            : 'text-gray-500';
  const cardBg      = d ? 'bg-slate-800 border-slate-700'             : 'bg-white border-gray-200';
  const subCardBg   = d ? 'bg-slate-700/60 border-slate-600'          : 'bg-gray-50 border-gray-200';
  const cardDragOver= d ? 'border-teal-400 bg-slate-700'              : 'border-teal-500 bg-teal-50';
  const divider     = d ? 'border-slate-700'                          : 'border-gray-100';
  const subDivider  = d ? 'border-slate-600'                          : 'border-gray-100';
  const songRow     = d ? 'bg-slate-600/40 hover:bg-slate-600/70'     : 'bg-white hover:bg-gray-50';
  const inputCls    = d
    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-teal-500'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500';
  const badgeCls    = d ? 'bg-slate-700 text-slate-300'               : 'bg-gray-100 text-gray-500';
  const accentText  = d ? 'text-teal-400'                             : 'text-teal-600';
  const accentBg    = 'bg-teal-600 hover:bg-teal-700 text-white';
  const ghostBtn    = d ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100';
  const dangerBtn   = d ? 'text-slate-400 hover:text-red-400 hover:bg-red-900/30'  : 'text-gray-400 hover:text-red-500 hover:bg-red-50';
  const toggleBtn   = d ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'         : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200';
  const addSubBtn   = d ? 'border-slate-600 text-slate-400 hover:border-teal-500 hover:text-teal-400' : 'border-gray-200 text-gray-500 hover:border-teal-500 hover:text-teal-600';
  const modalBg     = d ? 'bg-slate-800'                              : 'bg-white';
  const modalInput  = d
    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-teal-500'
    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-teal-500';
  const connectorLine = d ? 'border-slate-600' : 'border-gray-200';

  // ── Song list renderer (shared between parent & sub) ──────────────────────

  const handleSpotifySelect = async (key: string, song: { title: string; artist: string; spotifyId: string; previewUrl?: string | null; spotifyUrl?: string | null }) => {
    const parts = key.split('/');
    const newSong: Song = {
      id: song.spotifyId || uid(),
      title: song.title,
      artist: song.artist,
      ...(song.previewUrl ? { previewUrl: song.previewUrl } : {}),
      ...(song.spotifyUrl ? { spotifyUrl: song.spotifyUrl } : {}),
    };
    try {
      if (parts.length === 1) {
        const section = sections.find(s => s.id === key);
        if (!section) return;
        await updateDoc(doc(db, 'timelineItems', key), {
          songs: [...(section.songs || []), newSong],
        });
      } else {
        const [parentId, subId] = parts;
        const parent = sections.find(s => s.id === parentId);
        if (!parent) return;
        const updatedChildren = parent.children.map(c =>
          c.id === subId ? { ...c, songs: [...(c.songs || []), newSong] } : c
        );
        await updateDoc(doc(db, 'timelineItems', parentId), { children: updatedChildren });
      }
      load();
    } catch (e) { console.error(e); }
  };

  const renderSongs = (songs: Song[], key: string) => {
    const input = songInputs[key] || { title: '', artist: '' };
    const spotifyOpen = spotifyOpenKey === key;
    return (
      <div className="space-y-1.5">
        {songs.map((song, i) => {
          const isPlaying = playingId === song.id;
          return (
            <div key={song.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${songRow}`}>
              <span className={`text-xs w-5 text-right flex-shrink-0 tabular-nums ${subText}`}>{i + 1}</span>

              {/* Play preview button */}
              {song.previewUrl ? (
                <button
                  onClick={() => togglePreview(song)}
                  title={isPlaying ? 'Pause preview' : 'Play 30s preview'}
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    isPlaying
                      ? 'bg-green-500 text-white'
                      : dark ? 'bg-slate-600 hover:bg-green-600 text-slate-300 hover:text-white' : 'bg-gray-200 hover:bg-green-500 text-gray-600 hover:text-white'
                  }`}
                >
                  {isPlaying ? <HiPause className="w-3.5 h-3.5" /> : <HiPlay className="w-3.5 h-3.5 ml-0.5" />}
                </button>
              ) : (
                <MdMusicNote className={`w-4 h-4 flex-shrink-0 ${accentText}`} />
              )}

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${headerText}`}>{song.title}</p>
                <p className={`text-xs truncate ${subText}`}>{song.artist}</p>
              </div>

              {/* Actions — visible on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                {song.spotifyUrl && (
                  <a
                    href={song.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in Spotify"
                    className={`p-1.5 rounded-lg transition-colors ${dark ? 'hover:bg-slate-600 text-green-400' : 'hover:bg-gray-100 text-green-600'}`}
                  >
                    <SiSpotify className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => handleRemoveSong(key, song.id)}
                  className={`p-1 rounded transition-all ${dangerBtn}`}
                >
                  <MdClose className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add song row */}
        <div className="flex gap-2 pt-1">
          <input
            type="text" placeholder="Song title" value={input.title}
            onChange={e => setSongInputs(p => ({ ...p, [key]: { ...input, title: e.target.value } }))}
            onKeyDown={e => e.key === 'Enter' && handleAddSong(key)}
            className={`flex-1 px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputCls}`}
          />
          <input
            type="text" placeholder="Artist" value={input.artist}
            onChange={e => setSongInputs(p => ({ ...p, [key]: { ...input, artist: e.target.value } }))}
            onKeyDown={e => e.key === 'Enter' && handleAddSong(key)}
            className={`flex-1 px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inputCls}`}
          />
          <button
            onClick={() => handleAddSong(key)}
            disabled={!input.title?.trim() || !input.artist?.trim()}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0 transition-colors ${accentBg} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <MdAdd className="w-4 h-4" /> Add
          </button>
          {/* Spotify search toggle */}
          <button
            onClick={() => toggleSpotify(key)}
            title="Search Spotify"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0 transition-colors border ${
              spotifyOpen
                ? 'bg-green-600 border-green-600 text-white'
                : dark
                  ? 'border-slate-600 text-green-400 hover:bg-slate-700'
                  : 'border-gray-300 text-green-600 hover:bg-gray-50'
            }`}
          >
            <SiSpotify className="w-4 h-4" />
          </button>
        </div>

        {/* Spotify search panel */}
        {spotifyOpen && (
          <SpotifySearchPanel
            dark={dark}
            onClose={() => setSpotifyOpenKey(null)}
            onSelectSong={song => handleSpotifySelect(key, song)}
          />
        )}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute>
      <div className={`${bg} min-h-screen flex flex-col transition-colors duration-300`}>
        <Navbar />
        <EventHero eventId={eventId} dark={dark} />
        <div className="flex-grow max-w-4xl mx-auto w-full px-4 py-8">

          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${headerText}`}>Timeline & Music</h1>
              <p className={`text-sm mt-1 ${subText}`}>
                {sections.length} {sections.length === 1 ? 'section' : 'sections'} · drag to reorder
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggleDark} className={`p-2 rounded-lg transition-colors ${toggleBtn}`} title="Toggle dark mode">
                {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => openCreate(null)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${accentBg}`}
              >
                <MdAdd className="w-5 h-5" /> Add Section
              </button>
            </div>
          </div>

          <DashboardNav eventId={eventId} />

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <p className={subText}>Loading your event...</p>
            </div>
          ) : sections.length === 0 ? (

            /* Empty state */
            <div className={`rounded-2xl border-2 border-dashed ${d ? 'border-slate-700' : 'border-gray-200'} flex flex-col items-center justify-center py-24 gap-4`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${d ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <BsMusicNoteBeamed className={`w-8 h-8 ${accentText}`} />
              </div>
              <div className="text-center">
                <p className={`font-semibold text-lg ${headerText}`}>No sections yet</p>
                <p className={`text-sm mt-1 ${subText}`}>Add your first section — e.g. "Ceremony", "Dinner", "Reception"</p>
              </div>
              <button onClick={() => openCreate(null)} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium ${accentBg}`}>
                <MdAdd className="w-5 h-5" /> Add Section
              </button>
            </div>

          ) : (
            /* Section list */
            <div className="space-y-3">
              {sections.map((section, idx) => {
                const isExpanded = expandedIds.has(section.id);
                const isDragging = draggingId === section.id;
                const isDragOver = dragOverId === section.id && draggingId !== section.id;
                const songCount = (section.songs || []).length + section.children.reduce((acc, c) => acc + (c.songs || []).length, 0);

                return (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={e => onParentDragStart(e, section.id)}
                    onDragOver={e => onParentDragOver(e, section.id)}
                    onDrop={e => onParentDrop(e, section.id)}
                    onDragEnd={() => { setDraggingId(null); setDragOverId(null); }}
                    className={`rounded-2xl border transition-all duration-200 ${cardBg} ${isDragging ? 'opacity-40 scale-[0.98]' : ''} ${isDragOver ? cardDragOver : ''}`}
                  >
                    {/* ── Parent header ──────────────────────────── */}
                    <div className="flex items-center gap-3 px-4 py-4">
                      <div className={`cursor-grab active:cursor-grabbing transition-colors flex-shrink-0 ${subText} hover:text-teal-500`}>
                        <MdDragIndicator className="w-5 h-5" />
                      </div>
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${d ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-700'}`}>
                        {idx + 1}
                      </div>
                      <span className="text-xl flex-shrink-0">{getIcon(section.title)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span className={`text-sm font-semibold flex-shrink-0 ${accentText}`}>{section.time || '—'}</span>
                          <span className={`font-bold text-base truncate ${headerText}`}>{section.title}</span>
                          {section.children.length > 0 && (
                            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${d ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                              {section.children.length} sub
                            </span>
                          )}
                        </div>
                        {section.description && !isExpanded && (
                          <p className={`text-xs truncate mt-0.5 ${subText}`}>{section.description}</p>
                        )}
                      </div>
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${badgeCls}`}>
                        <MdMusicNote className="w-3.5 h-3.5" />{songCount}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => openEdit(section, null)} className={`p-1.5 rounded-lg transition-colors ${ghostBtn}`} title="Edit"><MdEdit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteSection(section.id)} className={`p-1.5 rounded-lg transition-colors ${dangerBtn}`} title="Delete"><MdDelete className="w-4 h-4" /></button>
                        <button onClick={() => toggle(section.id)} className={`p-1.5 rounded-lg transition-colors ${ghostBtn}`}>
                          {isExpanded ? <HiChevronUp className="w-4 h-4" /> : <HiChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* ── Expanded content ──────────────────────── */}
                    {isExpanded && (
                      <div className={`border-t ${divider} px-4 pb-4 pt-3 space-y-4`}>

                        {section.description && (
                          <p className={`text-sm ${subText}`}>{section.description}</p>
                        )}

                        {/* Parent-level songs (if any) */}
                        {(section.songs || []).length > 0 && (
                          <div>
                            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${subText}`}>Section Songs</p>
                            {renderSongs(section.songs, section.id)}
                          </div>
                        )}
                        {(section.songs || []).length === 0 && section.children.length === 0 && (
                          <div>{renderSongs([], section.id)}</div>
                        )}

                        {/* ── Sub-sections ─────────────────────── */}
                        {section.children.length > 0 && (
                          <div className={`space-y-2 pl-4 border-l-2 ${connectorLine}`}>
                            {section.children.map((sub) => {
                              const subKey = `${section.id}/${sub.id}`;
                              const subExpanded = expandedIds.has(subKey);
                              const isSubDragging = draggingSubKey === subKey;
                              const isSubDragOver = dragOverSubKey === subKey && draggingSubKey !== subKey;

                              return (
                                <div
                                  key={sub.id}
                                  draggable
                                  onDragStart={e => onSubDragStart(e, section.id, sub.id)}
                                  onDragOver={e => onSubDragOver(e, section.id, sub.id)}
                                  onDrop={e => onSubDrop(e, section.id, sub.id)}
                                  onDragEnd={() => { setDraggingSubKey(null); setDragOverSubKey(null); }}
                                  className={`rounded-xl border transition-all duration-150 ${subCardBg} ${isSubDragging ? 'opacity-40 scale-[0.98]' : ''} ${isSubDragOver ? cardDragOver : ''}`}
                                >
                                  {/* Sub-section header */}
                                  <div className="flex items-center gap-2 px-3 py-3">
                                    <div className={`cursor-grab active:cursor-grabbing flex-shrink-0 ${subText} hover:text-teal-500`}>
                                      <MdDragIndicator className="w-4 h-4" />
                                    </div>
                                    <span className="text-base flex-shrink-0">{getIcon(sub.title)}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-baseline gap-2 flex-wrap">
                                        <span className={`text-xs font-semibold flex-shrink-0 ${accentText}`}>{sub.time || '—'}</span>
                                        <span className={`text-sm font-semibold truncate ${headerText}`}>{sub.title}</span>
                                      </div>
                                      {sub.description && !subExpanded && (
                                        <p className={`text-xs truncate mt-0.5 ${subText}`}>{sub.description}</p>
                                      )}
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs flex-shrink-0 ${badgeCls}`}>
                                      <MdMusicNote className="w-3 h-3" />{(sub.songs || []).length}
                                    </div>
                                    <div className="flex items-center gap-0.5 flex-shrink-0">
                                      <button onClick={() => openEdit(sub, section.id)} className={`p-1 rounded-lg transition-colors ${ghostBtn}`}><MdEdit className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => handleDeleteSub(section.id, sub.id)} className={`p-1 rounded-lg transition-colors ${dangerBtn}`}><MdDelete className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => toggle(subKey)} className={`p-1 rounded-lg transition-colors ${ghostBtn}`}>
                                        {subExpanded ? <HiChevronUp className="w-3.5 h-3.5" /> : <HiChevronDown className="w-3.5 h-3.5" />}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Sub-section expanded */}
                                  {subExpanded && (
                                    <div className={`border-t ${subDivider} px-3 pb-3 pt-2.5`}>
                                      {sub.description && (
                                        <p className={`text-xs mb-3 ${subText}`}>{sub.description}</p>
                                      )}
                                      {renderSongs(sub.songs || [], subKey)}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Add sub-section button */}
                        <button
                          onClick={() => openCreate(section.id)}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed text-sm font-medium transition-colors ${addSubBtn}`}
                        >
                          <MdAdd className="w-4 h-4" />
                          Add sub-section
                        </button>

                        {/* If parent has no songs yet, show add-song row only after sub-sections */}
                        {(section.songs || []).length === 0 && section.children.length > 0 && (
                          <div>
                            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${subText}`}>Section-wide Songs</p>
                            {renderSongs([], section.id)}
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Modal ──────────────────────────────────────────────────────────── */}
        {modal.open && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl shadow-2xl w-full max-w-md ${modalBg}`}>
              <div className={`flex items-center justify-between px-6 py-5 border-b ${divider}`}>
                <h2 className={`text-lg font-semibold ${headerText}`}>
                  {modal.editing
                    ? `Edit ${modal.parentId ? 'Sub-section' : 'Section'}`
                    : `New ${modal.parentId ? 'Sub-section' : 'Section'}`}
                </h2>
                {modal.parentId && !modal.editing && (
                  <span className={`text-xs px-2 py-1 rounded-full ${d ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-700'}`}>
                    inside {sections.find(s => s.id === modal.parentId)?.title}
                  </span>
                )}
                <button onClick={closeModal} className={`p-1.5 rounded-lg transition-colors ${ghostBtn}`}>
                  <MdClose className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${headerText}`}>Time</label>
                  <input
                    type="text" value={form.time} required
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors ${modalInput}`}
                    placeholder="e.g. 6:00 PM"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${headerText}`}>
                    {modal.parentId ? 'Sub-section Name' : 'Section Name'}
                  </label>
                  <input
                    type="text" value={form.title} required
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors ${modalInput}`}
                    placeholder={modal.parentId ? 'e.g. Toast, Blessing, Cake Cutting' : 'e.g. Dinner, Ceremony, Reception'}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${headerText}`}>
                    Notes <span className={subText}>(optional)</span>
                  </label>
                  <textarea
                    value={form.description} rows={3}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none transition-colors ${modalInput}`}
                    placeholder="Any notes about this moment..."
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="submit" className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${accentBg}`}>
                    {modal.editing ? 'Save Changes' : `Create ${modal.parentId ? 'Sub-section' : 'Section'}`}
                  </button>
                  <button type="button" onClick={closeModal} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${d ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
