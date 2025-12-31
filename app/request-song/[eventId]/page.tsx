'use client';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default function RequestSongPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params.eventId as string;
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({
    songTitle: '',
    artist: '',
    guestName: '',
  });
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    // Validate token and load event info
    const validateAndLoad = async () => {
      if (!token) {
        setError('Invalid or missing invite token. Please use the invite link provided to you.');
        setValidating(false);
        return;
      }

      try {
        // Validate token
        const validateResponse = await fetch(`/api/invites/validate?token=${encodeURIComponent(token)}`);
        const validateData = await validateResponse.json();

        if (!validateData.valid) {
          setError(validateData.error || 'Invalid or expired invite token.');
          setValidating(false);
          return;
        }

        // Token is valid, set event name
        if (validateData.eventName) {
          setEventName(validateData.eventName);
        } else {
          // Fallback: try to load from Firestore (may fail due to security rules)
          try {
            const eventRef = doc(db, 'events', eventId);
            const eventSnap = await getDoc(eventRef);
            if (eventSnap.exists()) {
              setEventName(eventSnap.data().name || '');
            }
          } catch (error) {
            // Non-critical, continue without event name
            console.error('Error loading event:', error);
          }
        }

        setValidating(false);
      } catch (error) {
        console.error('Error validating token:', error);
        setError('Failed to validate invite token. Please try again.');
        setValidating(false);
      }
    };

    if (eventId && token) {
      validateAndLoad();
    } else if (!token) {
      setError('Invalid or missing invite token. Please use the invite link provided to you.');
      setValidating(false);
    }
  }, [eventId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!token) {
      setError('Missing invite token');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/guest/song-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          songTitle: formData.songTitle,
          artist: formData.artist,
          guestName: formData.guestName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ songTitle: '', artist: '', guestName: '' });
      } else {
        setError(data.error || 'Failed to submit request');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
      console.error('Error submitting request:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar></Navbar>
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <div className="mb-4 text-6xl">✓</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Your song request has been submitted successfully. The event organizer will review it shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </div>
        <Footer></Footer>
      </div>
    );
  }

  if (validating) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar></Navbar>
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <p className="mt-4 text-gray-600">Validating invite...</p>
          </div>
        </div>
        <Footer></Footer>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar></Navbar>
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Invite</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500">
              Please contact the event organizer for a valid invite link.
            </p>
          </div>
        </div>
        <Footer></Footer>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar></Navbar>
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-center mb-2 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Request a Song
          </h1>
          {eventName && (
            <p className="text-center mb-8 text-gray-600">For: {eventName}</p>
          )}
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <div>
                <label htmlFor="guestName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your Name
                </label>
                <input
                  type="text"
                  id="guestName"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="songTitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Song Title
                </label>
                <input
                  type="text"
                  id="songTitle"
                  value={formData.songTitle}
                  onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                  placeholder="Song title"
                  required
                />
              </div>

              <div>
                <label htmlFor="artist" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Artist
                </label>
                <input
                  type="text"
                  id="artist"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                  placeholder="Artist name"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}

