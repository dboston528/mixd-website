'use client';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  musicCue?: string;
  songId?: string;
  order: number;
}

export default function TimelinePage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [formData, setFormData] = useState({
    time: '',
    title: '',
    description: '',
    musicCue: '',
  });

  useEffect(() => {
    loadTimeline();
  }, [eventId]);

  const loadTimeline = async () => {
    try {
      const timelineRef = collection(db, 'timelineItems');
      const q = query(
        timelineRef,
        where('eventId', '==', eventId),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      const itemsData: TimelineItem[] = [];
      querySnapshot.forEach((doc) => {
        itemsData.push({ id: doc.id, ...doc.data() } as TimelineItem);
      });
      
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing item
        const itemRef = doc(db, 'timelineItems', editingItem.id);
        await updateDoc(itemRef, {
          time: formData.time,
          title: formData.title,
          description: formData.description,
          musicCue: formData.musicCue || '',
        });
      } else {
        // Create new item
        await addDoc(collection(db, 'timelineItems'), {
          eventId: eventId,
          time: formData.time,
          title: formData.title,
          description: formData.description,
          musicCue: formData.musicCue || '',
          order: items.length,
          createdAt: Timestamp.now(),
        });
      }
      
      setFormData({ time: '', title: '', description: '', musicCue: '' });
      setShowCreateModal(false);
      setEditingItem(null);
      loadTimeline();
    } catch (error) {
      console.error('Error saving timeline item:', error);
    }
  };

  const handleEdit = (item: TimelineItem) => {
    setEditingItem(item);
    setFormData({
      time: item.time,
      title: item.title,
      description: item.description,
      musicCue: item.musicCue || '',
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this timeline item?')) return;
    
    try {
      await deleteDoc(doc(db, 'timelineItems', itemId));
      loadTimeline();
    } catch (error) {
      console.error('Error deleting timeline item:', error);
    }
  };

  const handleCancel = () => {
    setShowCreateModal(false);
    setEditingItem(null);
    setFormData({ time: '', title: '', description: '', musicCue: '' });
  };

  return (
    <ProtectedRoute>
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar></Navbar>
        
        <div className="container mx-auto px-4 py-12 flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              Event Timeline
            </h1>
            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({ time: '', title: '', description: '', musicCue: '' });
                setShowCreateModal(true);
              }}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              + Add Timeline Item
            </button>
          </div>

          <DashboardNav eventId={eventId} />

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600">Loading timeline...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No timeline items yet. Create your first timeline item!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Add Timeline Item
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-lg font-bold text-teal-600">{item.time}</span>
                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-700 mb-2">{item.description}</p>
                      {item.musicCue && (
                        <p className="text-sm text-gray-600 italic">Music: {item.musicCue}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Delete
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
              <h2 className="text-2xl font-bold mb-4">
                {editingItem ? 'Edit Timeline Item' : 'Create Timeline Item'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Time
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., 6:00 PM"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., Ceremony, First Dance"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Event description"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Music Cue (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.musicCue}
                    onChange={(e) => setFormData({ ...formData, musicCue: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., First Dance Song"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
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

