'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { useAuthStore } from '@/lib/store';
import { enrollmentsApi, progressApi } from '@/lib/api';
import { Play, ArrowRight, Users, Zap } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuthStore();

  const { data: enrollments } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentsApi.getMy().then((r) => r.data),
  });

  const { data: velocity } = useQuery({
    queryKey: ['learning-velocity'],
    queryFn: () => progressApi.getVelocity().then((r) => r.data),
  });

  const inProgress = enrollments?.filter((e: any) => !e.isCompleted) ?? MOCK_ENROLLMENTS;

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="student" />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-border px-8 py-5">
          <h1 className="text-2xl font-bold">
            Welcome back, <span className="text-primary">{user?.fullName?.split(' ')[0] ?? 'Alex'} Mercer.</span>
          </h1>
          <p className="text-text-muted text-sm mt-0.5">
            Your learning vector is optimal. Let&apos;s resume your journey to Full-Stack Lead.
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* In Progress */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                IN PROGRESS
              </h2>
              <Link href="/dashboard/student/courses" className="text-xs text-primary hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {inProgress.slice(0, 2).map((e: any) => (
                <EnrollmentCard key={e.id} enrollment={e} />
              ))}
            </div>
          </div>

          {/* Upcoming Live + Learning Velocity */}
          <div className="grid grid-cols-3 gap-5">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">UPCOMING LIVE</h3>
                <span className="badge badge-blue text-xs">Live</span>
              </div>
              <div className="space-y-3">
                {UPCOMING.map((u) => (
                  <div key={u.title} className="p-3 rounded-xl bg-surface border border-border">
                    <div className="text-sm font-medium mb-1">{u.title}</div>
                    <div className="text-xs text-text-muted">{u.time}</div>
                    <button className="mt-2 text-xs text-primary flex items-center gap-1 hover:underline">
                      <Users size={11} /> Join Waiting Room
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap size={16} className="text-primary" /> Learning Velocity
                </h3>
                <div className="flex gap-2 text-xs text-text-muted">
                  <button className="px-2 py-1 rounded bg-surface border border-border">Lessons</button>
                  <button className="px-2 py-1 rounded hover:bg-surface">Avg</button>
                  <button className="px-2 py-1 rounded hover:bg-surface">Acc</button>
                </div>
              </div>
              {/* Velocity heatmap-style grid */}
              <div className="grid grid-cols-7 gap-1.5 mb-3">
                {Array.from({ length: 28 }, (_, i) => {
                  const intensity = Math.random();
                  return (
                    <div
                      key={i}
                      className="h-7 rounded"
                      style={{
                        background: intensity > 0.7
                          ? 'rgba(108,71,255,0.8)'
                          : intensity > 0.4
                          ? 'rgba(108,71,255,0.4)'
                          : intensity > 0.1
                          ? 'rgba(108,71,255,0.15)'
                          : 'rgba(42,42,69,0.5)',
                      }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-text-muted">
                <span>4 weeks ago</span>
                <span>This week</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function EnrollmentCard({ enrollment }: { enrollment: any }) {
  const course = enrollment.course ?? enrollment;
  const progress = enrollment.progressPercent ?? Math.floor(Math.random() * 80 + 10);

  return (
    <div className="card hover:border-primary/40 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-xs text-text-muted mb-1">{course.tags?.[0] ?? 'Advanced'} • {course.level ?? 'Advanced'}</div>
          <h3 className="font-semibold leading-tight">{course.title}</h3>
        </div>
        <span className="badge badge-purple ml-2 text-xs">{progress}%</span>
      </div>
      <div className="h-1.5 bg-surface rounded-full mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent-blue transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-text-muted">
          {course.instructor?.fullName ?? 'Alex Mercer'} · {course.tags?.join(' · ') ?? 'React · Next.js'}
        </div>
        <Link href={`/courses/${course.id}`} className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium">
          Resume <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

const MOCK_ENROLLMENTS = [
  {
    id: '1',
    progressPercent: 67,
    course: {
      id: '1',
      title: 'Advanced React Patterns & Next.js 14',
      level: 'Advanced',
      tags: ['React', 'Next.js', 'TypeScript'],
      instructor: { fullName: 'Alex Mercer' },
    },
  },
  {
    id: '2',
    progressPercent: 23,
    course: {
      id: '2',
      title: 'System Architecture & Backend Engineering',
      level: 'Advanced',
      tags: ['NestJS', 'Docker'],
      instructor: { fullName: 'Sarah Chen' },
    },
  },
];

const UPCOMING = [
  { title: 'System Architecture Deep Dive', time: 'Today · 18:00 UTC' },
  { title: 'Live Code Review Session', time: 'Tomorrow · 14:00 UTC' },
];
