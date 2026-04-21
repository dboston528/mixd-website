'use client';
import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { MdCameraAlt, MdClose } from 'react-icons/md';

interface EventData {
  name: string;
  date: { toDate: () => Date };
  type: string;
  userId: string;
  heroImageUrl?: string;
}

interface Props {
  eventId: string;
  dark?: boolean;
}

export default function EventHero({ eventId, dark = false }: Props) {
  const { currentUser } = useAuth();
  const [event, setEvent] = useState<EventData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const snap = await getDoc(doc(db, 'events', eventId));
      if (snap.exists()) {
        setEvent(snap.data() as EventData);
      }
    } catch (err) {
      console.error('Error loading event for hero:', err);
    }
  };

  const isOwner = currentUser?.uid === event?.userId;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const storageRef = ref(storage, `events/${eventId}/hero`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (err) => {
          console.error('Upload error:', err);
          setError('Upload failed. Please try again.');
          setUploading(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          // Save to Firestore
          await updateDoc(doc(db, 'events', eventId), { heroImageUrl: downloadUrl });
          setEvent(prev => prev ? { ...prev, heroImageUrl: downloadUrl } : prev);
          setUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. Please try again.');
      setUploading(false);
    }

    // Reset file input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveHero = async () => {
    if (!event?.heroImageUrl) return;
    try {
      await updateDoc(doc(db, 'events', eventId), { heroImageUrl: null });
      setEvent(prev => prev ? { ...prev, heroImageUrl: undefined } : prev);
    } catch (err) {
      console.error('Error removing hero:', err);
    }
  };

  if (!event) return null;

  const hasHero = !!event.heroImageUrl;
  const eventDate = event.date?.toDate?.()?.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }) ?? '';

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '220px' }}>

      {/* Background */}
      {hasHero ? (
        <img
          src={event.heroImageUrl}
          alt="Event hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 ${dark
          ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900'
          : 'bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-600'
        }`} />
      )}

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end px-6 pb-5">
        <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">{event.type}</p>
        <h2 className="text-3xl font-bold text-white leading-tight">{event.name}</h2>
        {eventDate && (
          <p className="text-sm text-white/80 mt-1">{eventDate}</p>
        )}
      </div>

      {/* Owner controls */}
      {isOwner && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {hasHero && !uploading && (
            <button
              onClick={handleRemoveHero}
              title="Remove photo"
              className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white/80 hover:text-white transition-colors"
            >
              <MdClose className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title={hasHero ? 'Change photo' : 'Add photo'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white text-xs font-medium transition-colors disabled:opacity-50"
          >
            <MdCameraAlt className="w-3.5 h-3.5" />
            {uploading ? `${uploadProgress}%` : hasHero ? 'Change photo' : 'Add photo'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Upload progress bar */}
      {uploading && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-teal-400 transition-all duration-200"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1.5 rounded-full">
          {error}
        </div>
      )}
    </div>
  );
}
