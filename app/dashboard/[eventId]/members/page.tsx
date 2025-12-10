'use client';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  deleteDoc, 
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useAuth } from '../../../../contexts/AuthContext';

interface EventMember {
  id: string;
  eventId: string;
  userId: string;
  role: 'client' | 'dj' | 'admin';
  createdAt: Timestamp;
  userName?: string;
  userEmail?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function MembersPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const { currentUser } = useAuth();
  
  const [members, setMembers] = useState<EventMember[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<'client' | 'dj' | 'admin'>('client');

  useEffect(() => {
    if (currentUser) {
      loadUserRole();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && userRole) {
      loadMembers();
      if (userRole === 'admin') {
        loadAllUsers();
      }
    }
  }, [currentUser, userRole, eventId]);

  const loadUserRole = async () => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserRole(userSnap.data().role || 'client');
      } else {
        setUserRole('client');
      }
    } catch (error) {
      console.error('Error loading user role:', error);
      setUserRole('client');
    }
  };

  const loadMembers = async () => {
    try {
      const membersRef = collection(db, 'eventMembers');
      const q = query(membersRef, where('eventId', '==', eventId));
      const querySnapshot = await getDocs(q);
      
      const membersData: EventMember[] = [];
      
      // Load user details for each member
      for (const docSnap of querySnapshot.docs) {
        const memberData = docSnap.data() as EventMember;
        try {
          const userRef = doc(db, 'users', memberData.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            membersData.push({
              ...memberData,
              id: docSnap.id,
              userName: userData.name || '',
              userEmail: userData.email || '',
            });
          } else {
            // Fallback if user doc doesn't exist
            membersData.push({
              ...memberData,
              id: docSnap.id,
              userName: 'Unknown',
              userEmail: 'Unknown',
            });
          }
        } catch (error) {
          console.error('Error loading user for member:', error);
          membersData.push({
            ...memberData,
            id: docSnap.id,
            userName: 'Unknown',
            userEmail: 'Unknown',
          });
        }
      }
      
      setMembers(membersData);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const usersData: User[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() } as User);
      });
      
      setAllUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !userRole || userRole !== 'admin') return;
    
    // Check if user is already a member
    const existingMember = members.find(m => m.userId === selectedUserId);
    if (existingMember) {
      alert('This user is already a member of this event.');
      return;
    }
    
    try {
      await addDoc(collection(db, 'eventMembers'), {
        eventId: eventId,
        userId: selectedUserId,
        role: selectedRole,
        createdAt: Timestamp.now(),
      });
      
      setSelectedUserId('');
      setSelectedRole('client');
      setShowAddModal(false);
      loadMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member. Please try again.');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member from the event?')) return;
    if (!userRole || userRole !== 'admin') return;
    
    try {
      await deleteDoc(doc(db, 'eventMembers', memberId));
      loadMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member. Please try again.');
    }
  };

  const filteredUsers = allUsers.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(query) ||
      (user.name && user.name.toLowerCase().includes(query))
    );
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'dj':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="bg-white min-h-screen flex flex-col">
          <Navbar />
          <div className="container mx-auto px-4 py-12 flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600">Loading members...</p>
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container mx-auto px-4 py-12 flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              Event Members
            </h1>
            {userRole === 'admin' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                + Add User
              </button>
            )}
          </div>

          <DashboardNav eventId={eventId} />

          {members.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No members added to this event yet.</p>
              {userRole === 'admin' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Add First Member
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {member.userName || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{member.userEmail}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(member.role)}`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    </div>
                    {userRole === 'admin' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-800 text-sm px-3 py-1 bg-red-50 rounded"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Member Modal */}
        {showAddModal && userRole === 'admin' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Add User to Event</h2>
              
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Search Users
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Search by name or email..."
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Select User *
                  </label>
                  {filteredUsers.length === 0 ? (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600">No users found matching your search.</p>
                    </div>
                  ) : (
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      required
                    >
                      <option value="">Select a user...</option>
                      {filteredUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name || user.email} ({user.email}) - {user.role}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Role for this Event *
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as 'client' | 'dj' | 'admin')}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    required
                  >
                    <option value="client">Client</option>
                    <option value="dj">DJ</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Add Member
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setSearchQuery('');
                      setSelectedUserId('');
                      setSelectedRole('client');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </ProtectedRoute>
  );
}


