'use client';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import DashboardNav from '../../../../components/dashboard/DashboardNav';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { auth } from '../../../../lib/firebase';

interface Invite {
  inviteId: string;
  createdAt: any;
  expiresAt: any;
  revoked: boolean;
  useCount: number;
  maxUses: number | null;
  lastUsedAt: any;
  createdBy: string;
  metadata?: {
    guestName?: string;
    customMessage?: string;
  };
}

interface CreateInviteData {
  expiresAt: string;
  maxUses: string;
  guestName: string;
  customMessage: string;
}

export default function InvitesPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const { currentUser } = useAuth();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newInvite, setNewInvite] = useState<CreateInviteData>({
    expiresAt: '',
    maxUses: '',
    guestName: '',
    customMessage: '',
  });
  const [createdInvite, setCreatedInvite] = useState<{
    token: string;
    inviteUrl: string;
  } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadInvites();
    }
  }, [eventId, currentUser]);

  const getAuthToken = async (): Promise<string | null> => {
    if (!currentUser) return null;
    try {
      return await currentUser.getIdToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  const loadInvites = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError('');

    try {
      const token = await getAuthToken();
      if (!token) {
        setError('Failed to authenticate');
        return;
      }

      const response = await fetch(`/api/invites?eventId=${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to load invites');
      }

      const data = await response.json();
      setInvites(data.invites || []);
    } catch (err: any) {
      console.error('Error loading invites:', err);
      setError(err.message || 'Failed to load invites');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setCreating(true);
    setError('');

    try {
      const token = await getAuthToken();
      if (!token) {
        setError('Failed to authenticate');
        return;
      }

      const requestBody: any = {
        eventId,
      };

      // Parse expiration date
      if (newInvite.expiresAt) {
        requestBody.expiresAt = newInvite.expiresAt;
      } else {
        requestBody.expiresAt = null;
      }

      // Parse max uses
      if (newInvite.maxUses && newInvite.maxUses.trim() !== '') {
        const maxUsesNum = parseInt(newInvite.maxUses, 10);
        if (isNaN(maxUsesNum) || maxUsesNum < 1) {
          setError('Max uses must be a positive number');
          setCreating(false);
          return;
        }
        requestBody.maxUses = maxUsesNum;
      } else {
        requestBody.maxUses = null;
      }

      // Add metadata if provided
      if (newInvite.guestName || newInvite.customMessage) {
        requestBody.metadata = {};
        if (newInvite.guestName) {
          requestBody.metadata.guestName = newInvite.guestName;
        }
        if (newInvite.customMessage) {
          requestBody.metadata.customMessage = newInvite.customMessage;
        }
      }

      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create invite');
      }

      const data = await response.json();
      setCreatedInvite({
        token: data.token,
        inviteUrl: data.inviteUrl,
      });
      setNewInvite({
        expiresAt: '',
        maxUses: '',
        guestName: '',
        customMessage: '',
      });
      setShowCreateModal(false);
      loadInvites();
    } catch (err: any) {
      console.error('Error creating invite:', err);
      setError(err.message || 'Failed to create invite');
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    if (!confirm('Are you sure you want to revoke this invite? It will no longer work.')) {
      return;
    }

    if (!currentUser) return;

    try {
      const token = await getAuthToken();
      if (!token) {
        setError('Failed to authenticate');
        return;
      }

      const response = await fetch(`/api/invites/${inviteId}/revoke`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to revoke invite');
      }

      loadInvites();
    } catch (err: any) {
      console.error('Error revoking invite:', err);
      setError(err.message || 'Failed to revoke invite');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy:', err);
    });
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'Never';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return 'Invalid date';
    }
  };

  const isExpired = (invite: Invite): boolean => {
    if (!invite.expiresAt) return false;
    try {
      const expiresAt = invite.expiresAt.toDate ? invite.expiresAt.toDate() : new Date(invite.expiresAt);
      return expiresAt < new Date();
    } catch {
      return false;
    }
  };

  const getQRCodeUrl = (url: string): string => {
    // Using a free QR code API
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  return (
    <ProtectedRoute>
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar></Navbar>
        
        <div className="container mx-auto px-4 py-12 flex-grow">
          <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl lg:text-6xl dark:text-white mb-6">
            Guest Invites
          </h1>

          <DashboardNav eventId={eventId} />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Create secure invite links for guests to request songs
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              + Create Invite
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600">Loading invites...</p>
            </div>
          ) : invites.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">No invites created yet. Create your first invite to get started!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Create Invite
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div
                  key={invite.inviteId}
                  className={`bg-white border rounded-lg p-6 shadow ${
                    invite.revoked || isExpired(invite)
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Invite #{invite.inviteId.substring(0, 8)}
                        </h3>
                        {invite.revoked && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Revoked
                          </span>
                        )}
                        {!invite.revoked && isExpired(invite) && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Expired
                          </span>
                        )}
                        {!invite.revoked && !isExpired(invite) && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="mb-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <span className="font-semibold">URL Pattern:</span>{' '}
                        <code className="text-xs">
                          /request-song/{eventId}?token=[token]
                        </code>
                        <p className="text-xs text-gray-500 mt-1">
                          Note: The full URL with token was only shown when the invite was created.
                          Create a new invite if you need to share the link again.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-semibold">Created:</span> {formatDate(invite.createdAt)}
                        </div>
                        <div>
                          <span className="font-semibold">Expires:</span>{' '}
                          {invite.expiresAt ? formatDate(invite.expiresAt) : 'Never'}
                        </div>
                        <div>
                          <span className="font-semibold">Uses:</span> {invite.useCount}
                          {invite.maxUses !== null && ` / ${invite.maxUses}`}
                        </div>
                        <div>
                          <span className="font-semibold">Last Used:</span> {formatDate(invite.lastUsedAt)}
                        </div>
                      </div>
                      {invite.metadata?.guestName && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-semibold">Guest Name:</span> {invite.metadata.guestName}
                        </p>
                      )}
                      {invite.metadata?.customMessage && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-semibold">Message:</span> {invite.metadata.customMessage}
                        </p>
                      )}
                    </div>
                    {!invite.revoked && (
                      <button
                        onClick={() => handleRevokeInvite(invite.inviteId)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Invite Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Create New Invite</h2>
                <form onSubmit={handleCreateInvite} className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Expiration Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={newInvite.expiresAt}
                      onChange={(e) => setNewInvite({ ...newInvite, expiresAt: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for no expiration</p>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Max Uses (Optional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newInvite.maxUses}
                      onChange={(e) => setNewInvite({ ...newInvite, maxUses: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Unlimited"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited uses</p>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Guest Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={newInvite.guestName}
                      onChange={(e) => setNewInvite({ ...newInvite, guestName: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Custom Message (Optional)
                    </label>
                    <textarea
                      value={newInvite.customMessage}
                      onChange={(e) => setNewInvite({ ...newInvite, customMessage: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      rows={3}
                      placeholder="Add a custom message for this invite"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                      {creating ? 'Creating...' : 'Create Invite'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setNewInvite({
                          expiresAt: '',
                          maxUses: '',
                          guestName: '',
                          customMessage: '',
                        });
                        setError('');
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

          {/* Created Invite Modal */}
          {createdInvite && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-4">Invite Created!</h2>
                <p className="text-gray-600 mb-4">
                  Share this link with your guests. This is the only time you'll see the full URL.
                </p>
                
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Invite URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={createdInvite.inviteUrl}
                      readOnly
                      className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(createdInvite.inviteUrl)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="mb-4 text-center">
                  <p className="text-sm font-medium text-gray-900 mb-2">QR Code</p>
                  <img
                    src={getQRCodeUrl(createdInvite.inviteUrl)}
                    alt="QR Code"
                    className="mx-auto border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Guests can scan this to open the invite link
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCreatedInvite(null);
                    loadInvites();
                  }}
                  className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        <Footer></Footer>
      </div>
    </ProtectedRoute>
  );
}

