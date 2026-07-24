'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { enrollmentsApi } from '@/lib/api';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';

export default function StudentCoursesPage() {
  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentsApi.getMy().then((r) => r.data),
  });

  const list = enrollments ?? [];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="student" />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border px-8 py-5">
          <h1 className="text-xl font-bold">My Courses</h1>
          <p className="text-text-muted text-sm">{list.length} courses enrolled</p>
        </div>
        <div className="p-8">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card h-24 animate-pulse bg-surface" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="card text-center py-16 text-text-muted">
              Vous n'êtes inscrit à aucune formation. <Link href="/courses" className="text-primary hover:underline">Parcourez le catalogue</Link>.
            </div>
          ) : (
            <div className="space-y-4">
              {list.map((e: any) => {
                const course = e.course ?? e;
                const progress = e.progressPercent ?? 0;
                return (
                  <div key={e.id} className="card flex items-center gap-5 hover:border-primary/40 transition-colors">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent-blue/10 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                      {course.title?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate mb-1">{course.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-text-muted mb-2">
                        <span className="flex items-center gap-1"><Clock size={11} /> {course.durationWeeks ?? 8}w</span>
                        <span className="flex items-center gap-1">{course.tags?.slice(0, 2).join(' · ')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-surface rounded-full max-w-xs">
                          <div className="h-full bg-gradient-to-r from-primary to-accent-blue rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs text-text-muted">{progress}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {e.isCompleted && (
                        <span className="flex items-center gap-1 text-xs text-accent-green">
                          <CheckCircle size={14} /> Completed
                        </span>
                      )}
                      <Link href={`/courses/${course.id}`} className="btn-primary text-sm flex items-center gap-1.5 py-2">
                        Resume <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
