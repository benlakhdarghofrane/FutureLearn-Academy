'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { BookOpen, ChevronDown } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen size={16} />
          </div>
          <span>FutureLearn<span className="text-text-muted font-normal"> Academy</span></span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                pathname === link.href
                  ? 'text-white bg-card'
                  : 'text-text-secondary hover:text-white hover:bg-card/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href={user?.role === 'instructor' ? '/dashboard/instructor' : '/dashboard/student'}
                className="text-sm text-text-secondary hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {user?.fullName?.charAt(0)}
                  </div>
                  <span className="text-sm text-white">{user?.fullName?.split(' ')[0]}</span>
                  <ChevronDown size={14} className="text-text-muted" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/profile" className="block px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-surface transition-colors">Profile</Link>
                  <Link href="/dashboard/student" className="block px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-surface transition-colors">Dashboard</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-surface transition-colors">Sign Out</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-text-secondary hover:text-white transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2">
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const NAV_LINKS = [
  { href: '/courses', label: 'Courses' },
  { href: '/paths', label: 'Paths' },
  { href: '/community', label: 'Community' },
  { href: '/mentors', label: 'Mentors' },
  { href: '/ai-assistant', label: 'AI Support' },
];
