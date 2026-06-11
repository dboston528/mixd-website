import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a Song',
  robots: { index: false, follow: false },
};

export default function RequestSongLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
