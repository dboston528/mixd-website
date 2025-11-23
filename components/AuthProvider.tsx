'use client';
import { AuthProvider as AuthContextProvider } from '../contexts/AuthContext';

export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}

