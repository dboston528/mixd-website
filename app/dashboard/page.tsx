'use client';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, Timestamp, or, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

interface Event {
  id: string;
  name: string;
  date: Timestamp;
  type: string;
  userId: string;
  assignedDJs?: string[];
}

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', type: 'Wedding', assignedDJs: [] as string[] });
  const [userRole, setUserRole] = useState<string | null>(null);
  const [allDJs, setAllDJs] = useState<Array<{ id: string; email: string; name: string }>>([]);

  useEffect(() => {
    if (currentUser) {
      loadUserRole();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && userRole) {
      loadEvents();
      if (userRole === 'admin') {
        loadAllDJs();
      }
    }
  }, [currentUser, userRole]);

  const loadUserRole = async () => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserRole(userSnap.data().role || 'client');
      } else {
        // Create user document with default role
        await setDoc(userRef, {
          email: currentUser.email,
          name: currentUser.displayName || '',
          role: 'client',
          createdAt: Timestamp.now(),
        });
        setUserRole('client');
      }
    } catch (error) {
      console.error('Error loading user role:', error);
      setUserRole('client');
    }
  };

  const loadAllDJs = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', 'in', ['dj', 'admin']));
      const querySnapshot = await getDocs(q);
      
      const djs: Array<{ id: string; email: string; name: string }> = [];
      querySnapshot.forEach((doc) => {
        djs.push({
          id: doc.id,
          email: doc.data().email || '',
          name: doc.data().name || doc.data().email || '',
        });
      });
      setAllDJs(djs);
    } catch (error) {
      console.error('Error loading DJs:', error);
    }
  };

  const loadEvents = async () => {
    if (!currentUser) return;
    
    try {
      const eventsRef = collection(db, 'events');
      let eventsData: Event[] = [];
      
      if (userRole === 'admin') {
        // Admins can see all events
        const querySnapshot = await getDocs(eventsRef);
        querySnapshot.forEach((doc) => {
          eventsData.push({ id: doc.id, ...doc.data() } as Event);
        });
      } else {
        // Regular users and DJs: get events they own OR are assigned to via assignedDJs OR eventMembers
        const ownedQuery = query(eventsRef, where('userId', '==', currentUser.uid));
        const assignedQuery = query(eventsRef, where('assignedDJs', 'array-contains', currentUser.uid));
        
        // Also check eventMembers collection
        const eventMembersRef = collection(db, 'eventMembers');
        const membersQuery = query(eventMembersRef, where('userId', '==', currentUser.uid));
        
        const [ownedSnapshot, assignedSnapshot, membersSnapshot] = await Promise.all([
          getDocs(ownedQuery),
          getDocs(assignedQuery),
          getDocs(membersQuery),
        ]);
        
        const eventMap = new Map<string, Event>();
        
        // Add owned events
        ownedSnapshot.forEach((doc) => {
          eventMap.set(doc.id, { id: doc.id, ...doc.data() } as Event);
        });
        
        // Add events assigned via assignedDJs
        assignedSnapshot.forEach((doc) => {
          eventMap.set(doc.id, { id: doc.id, ...doc.data() } as Event);
        });
        
        // Add events from eventMembers
        const memberEventIds = new Set<string>();
        membersSnapshot.forEach((doc) => {
          const memberData = doc.data();
          if (memberData.eventId) {
            memberEventIds.add(memberData.eventId);
          }
        });
        
        // Load events for which user is a member
        if (memberEventIds.size > 0) {
          const memberEventPromises = Array.from(memberEventIds).map(eventId => 
            getDoc(doc(db, 'events', eventId))
          );
          const memberEventDocs = await Promise.all(memberEventPromises);
          
          memberEventDocs.forEach((eventDoc) => {
            if (eventDoc.exists()) {
              eventMap.set(eventDoc.id, { id: eventDoc.id, ...eventDoc.data() } as Event);
            }
          });
        }
        
        eventsData = Array.from(eventMap.values());
      }
      
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const eventDate = new Date(newEvent.date);
      await addDoc(collection(db, 'events'), {
        name: newEvent.name,
        date: Timestamp.fromDate(eventDate),
        type: newEvent.type,
        userId: currentUser.uid,
        assignedDJs: newEvent.assignedDJs || [],
        createdAt: Timestamp.now(),
      });
      
      setNewEvent({ name: '', date: '', type: 'Wedding', assignedDJs: [] });
      setShowCreateModal(false);
      loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const toggleDJAssignment = (djId: string) => {
    setNewEvent(prev => {
      const currentDJs = prev.assignedDJs || [];
      if (currentDJs.includes(djId)) {
        return { ...prev, assignedDJs: currentDJs.filter(id => id !== djId) };
      } else {
        return { ...prev, assignedDJs: [...currentDJs, djId] };
      }
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar></Navbar>
        
        <div className="container mx-auto px-4 py-12 flex-grow">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                {userRole === 'admin' ? 'All Events' : userRole === 'dj' ? 'My Assigned Events' : 'My Events'}
              </h1>
              {userRole && (
                <p className="text-sm text-gray-600 mt-2">
                  Role: <span className="font-semibold capitalize">{userRole}</span>
                </p>
              )}
            </div>
            <div className="flex gap-4">
              {(userRole === 'client' || userRole === 'admin') && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  + New Event
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No events yet. Create your first event to get started!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Create Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => router.push(`/dashboard/${event.id}/playlists`)}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                    {event.userId !== currentUser?.uid && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Assigned
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{event.type}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    {event.date.toDate().toLocaleDateString()}
                  </p>
                  {event.assignedDJs && event.assignedDJs.length > 0 && (
                    <p className="text-xs text-gray-400">
                      {event.assignedDJs.length} DJ{event.assignedDJs.length !== 1 ? 's' : ''} assigned
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Event Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Private Event">Private Event</option>
                    <option value="School">School</option>
                    <option value="Mitzvah">Mitzvah</option>
                  </select>
                </div>
                {(userRole === 'admin' || userRole === 'client') && allDJs.length > 0 && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Assign DJs (Optional)
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                      {allDJs.map((dj) => (
                        <label key={dj.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newEvent.assignedDJs?.includes(dj.id) || false}
                            onChange={() => toggleDJAssignment(dj.id)}
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                          <span className="text-sm text-gray-700">{dj.name || dj.email}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
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

        <Footer></Footer>
      </div>
    </ProtectedRoute>
  );
}

