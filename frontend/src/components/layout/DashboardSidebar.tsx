'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
  LayoutDashboard, BookOpen, Users, Calendar,
  MessageSquare, Settings, HelpCircle, LogOut, BookMarked,
} from 'lucide-react';

interface SidebarProps {
  role: 'student' | 'instructor';
}

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const studentLinks = [
    { href: '/dashboard/student', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { href: '/dashboard/student/courses', icon: <BookOpen size={18} />, label: 'My Courses' },
    { href: '/dashboard/student/schedule', icon: <Calendar size={18} />, label: 'Schedule' },
    { href: '/dashboard/student/messages', icon: <MessageSquare size={18} />, label: 'Messages' },
    { href: '/profile', icon: <Settings size={18} />, label: 'Settings' },
  ];

  const instructorLinks = [
    { href: '/dashboard/instructor', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { href: '/dashboard/instructor/courses', icon: <BookOpen size={18} />, label: 'My Courses' },
    { href: '/dashboard/instructor/students', icon: <Users size={18} />, label: 'Students' },
    { href: '/dashboard/instructor/schedule', icon: <Calendar size={18} />, label: 'Schedule' },
    { href: '/dashboard/instructor/messages', icon: <MessageSquare size={18} />, label: 'Messages' },
  ];

  const links = role === 'instructor' ? instructorLinks : studentLinks;

  return (
    <aside className="w-60 min-h-screen bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <BookMarked size={14} />
          </div>
          <span className="text-sm">
            {role === 'instructor' ? 'TechnoNoir' : 'FutureLearn'}
            <span className="block text-xs font-normal text-text-muted capitalize">{role === 'instructor' ? 'Academy' : 'Academy'}</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`sidebar-item ${pathname === link.href ? 'active' : ''}`}
          >
            {link.icon}
            <span className="text-sm">{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* User + bottom links */}
      <div className="p-4 border-t border-border space-y-1">
        <Link href="/ai-assistant" className="sidebar-item">
          <HelpCircle size={18} />
          <span className="text-sm">Help Center</span>
        </Link>
        <button onClick={handleLogout} className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut size={18} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
