'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface NavItem {
  name: string;
  href: string;
  icon?: string;
}

export default function DashboardNav({ eventId }: { eventId: string }) {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadUserRole();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

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
    } finally {
      setLoading(false);
    }
  };
  
  const navItems: NavItem[] = [
    { name: 'Playlists', href: `/dashboard/${eventId}/playlists` },
    { name: 'Must Play', href: `/dashboard/${eventId}/must-play` },
    { name: 'Do Not Play', href: `/dashboard/${eventId}/do-not-play` },
    { name: 'Song Requests', href: `/dashboard/${eventId}/requests` },
    { name: 'Invites', href: `/dashboard/${eventId}/invites` },
    { name: 'Timeline & Music', href: `/dashboard/${eventId}/timeline` },
  ];

  // Add Members link for admins
  if (!loading && userRole === 'admin') {
    navItems.push({ name: 'Members', href: `/dashboard/${eventId}/members` });
  }

  return (
    <nav className="bg-gray-100 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

