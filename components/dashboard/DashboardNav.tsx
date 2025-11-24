'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon?: string;
}

export default function DashboardNav({ eventId }: { eventId: string }) {
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    { name: 'Playlists', href: `/dashboard/${eventId}/playlists` },
    { name: 'Must Play', href: `/dashboard/${eventId}/must-play` },
    { name: 'Do Not Play', href: `/dashboard/${eventId}/do-not-play` },
    { name: 'Song Requests', href: `/dashboard/${eventId}/requests` },
    { name: 'Timeline', href: `/dashboard/${eventId}/timeline` },
  ];

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

