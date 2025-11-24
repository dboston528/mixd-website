'use client';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Navbar } from 'flowbite-react';

export default function AdminLink() {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      checkAdminRole();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const checkAdminRole = async () => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setIsAdmin(userSnap.data().role === 'admin');
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <Navbar.Link href="/admin/users" className="inline-block md:py-3 hover:text-teal-600 transition-colors duration-200">
      Admin
    </Navbar.Link>
  );
}

