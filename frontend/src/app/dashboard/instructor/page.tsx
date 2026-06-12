'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { useAuthStore } from '@/lib/store';
import { coursesApi, usersApi } from '@/lib/api';
import { Plus, Bell, TrendingUp, BookOpen, Users, AlertCircle } from 'lucide-react';

export default function InstructorDashboard() {
  const { user } = useAuthStore();

  const { data: courses } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () => coursesApi.getMy().then((r) => r.data),
  });

  const { data: stats } = useQuery({
    queryKey: ['instructor-stats'],
    queryFn: () => usersApi.getStats().then((r) => r.data),
  });

  const totalStudents = stats?.totalStudents ?? 1248;
  const activeCourses = courses?.length ?? 6;
  const pendingReviews = 24;

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="instructor" />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-border px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, <span className="text-primary">Pro Developer</span>
            </h1>
            <p className="text-text-muted text-sm mt-0.5">Here&apos;s what&apos;s happening with your courses today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-text-secondary hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <Link href="/dashboard/instructor/courses/new" className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} /> Create New Course
            </Link>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-5 mb-8">
            <StatCard
              label="Total Students"
              value={totalStudents.toLocaleString()}
              trend="+12%"
              icon={<Users size={20} />}
              color="blue"
            />
            <StatCard
              label="Active Courses"
              value={activeCourses}
              icon={<BookOpen size={20} />}
              color="purple"
            />
            <StatCard
              label="Pending Project Reviews"
              value={pendingReviews}
              badge="Action Needed"
              icon={<AlertCircle size={20} />}
              color="orange"
            />
          </div>

          {/* Chart area */}
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Student Activity</h3>
                <select className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-text-secondary">
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                </select>
              </div>
              {/* Simple bar chart visual */}
              <div className="h-40 flex items-end gap-1.5">
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-primary/20 hover:bg-primary/40 transition-colors"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-text-muted">
                <span>30 days ago</span><span>Today</span>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">My Courses</h3>
              <div className="space-y-3">
                {(courses || MOCK_COURSES).slice(0, 4).map((c: any) => (
                  <Link key={c.id} href={`/dashboard/instructor/courses/${c.id}`}>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                        {c.title?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{c.title}</div>
                        <div className="text-xs text-text-muted">{c.enrollments?.length ?? 0} students</div>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link href="/dashboard/instructor/courses/new" className="flex items-center gap-2 text-xs text-primary hover:underline mt-2">
                  <Plus size={14} /> Add new course
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, trend, badge, icon, color }: any) {
  const colors: any = {
    blue: 'bg-accent-blue/10 text-accent-blue',
    purple: 'bg-primary/10 text-primary',
    orange: 'bg-orange-500/10 text-orange-400',
  };
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-full">
            <TrendingUp size={10} /> {trend}
          </span>
        )}
        {badge && (
          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-text-muted text-sm">{label}</div>
    </div>
  );
}

const MOCK_COURSES = [
  { id: '1', title: 'Full-Stack Web Development', enrollments: [1, 2, 3] },
  { id: '2', title: 'Advanced React Patterns', enrollments: [1, 2] },
  { id: '3', title: 'System Architecture', enrollments: [1] },
  { id: '4', title: 'Node.js Mastery', enrollments: [1, 2, 3, 4] },
];
