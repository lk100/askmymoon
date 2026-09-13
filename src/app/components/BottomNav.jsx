'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, MessageCircle, Newspaper, Users } from 'lucide-react';

const navItems = [
  { key: 'home', label: 'Home', href: '/', icon: Home },
  { key: 'chat', label: 'Chat', href: '/astrologers', icon: MessageCircle },
  { key: 'blogs', label: 'Blogs', href: '/blogs', icon: Newspaper },
  { key: 'counsels', label: 'Counsels', href: '/consultation', icon: Users },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm shadow-[0_-4px_16px_rgba(15,23,42,0.06)] sm:hidden"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-purple-700' : 'text-slate-500'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? 'text-purple-600' : 'text-slate-400'}`}
                strokeWidth={isActive ? 2.4 : 2}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}