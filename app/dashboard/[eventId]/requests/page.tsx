'use client';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { addSong } from '../../../../lib/db/eventSongs';

interface SongRequest {
  id: string;
  songTitle: string;
  artist: string;
  guestName: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Timestamp;
}

export default function RequestsPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadRequests();
  }, [eventId]);

  const loadRequests = async () => {
    try {
      const requestsRef = collection(db, 'songRequests');
      const q = query(requestsRef, where('eventId', '==', eventId));
      const querySnapshot = await getDocs(q);
      
      const requestsData: SongRequest[] = [];
      querySnapshot.forEach((doc) => {
        requestsData.push({ id: doc.id, ...doc.data() } as SongRequest);
      });
      
      // Sort by timestamp (newest first)
      requestsData.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const requestRef = doc(db, 'songRequests', requestId);
      await updateDoc(requestRef, {
        status: newStatus,
      });
      
      // If approved, create song in subcollection
      if (newStatus === 'approved') {
        const request = requests.find(r => r.id === requestId);
        if (request) {
          try {
            await addSong(eventId, {
              title: request.songTitle,
              artist: request.artist,
              tag: 'neutral',
              addedByType: 'guest',
              addedByGuestName: request.guestName,
            });
          } catch (subcollectionError) {
            // Log error but don't fail the operation
            console.error('Error creating song in subcollection (non-critical):', subcollectionError);
          }
        }
      }
      
      loadRequests();
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  return (
    <ProtectedRoute>
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar></Navbar>
        
        <div className="container mx-auto px-4 py-12 flex-grow">
          <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl dark:text-white mb-6">
            Song Requests
          </h1>

          <DashboardNav eventId={eventId} />

          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'approved' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'rejected' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Rejected
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No song requests {filter !== 'all' ? `with status "${filter}"` : ''} yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className={`bg-white border rounded-lg p-6 shadow ${
                    request.status === 'approved' ? 'border-green-500' :
                    request.status === 'rejected' ? 'border-red-500' :
                    'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{request.songTitle}</p>
                      <p className="text-gray-600">{request.artist}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Requested by: {request.guestName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {request.timestamp.toDate().toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(request.id, 'approved')}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(request.id, 'rejected')}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer></Footer>
      </div>
    </ProtectedRoute>
  );
}

