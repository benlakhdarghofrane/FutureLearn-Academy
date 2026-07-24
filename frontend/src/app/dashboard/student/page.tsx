'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { useAuthStore } from '@/lib/store';
import { enrollmentsApi, progressApi, certificatesApi } from '@/lib/api';
import { ArrowRight, Award, Zap } from 'lucide-react';

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

  const { data: certificates } = useQuery({
    queryKey: ['my-certificates'],
    queryFn: () => certificatesApi.getMy().then((r) => r.data),
  });

  const inProgress = (enrollments ?? []).filter((e: any) => !e.isCompleted);

  // Build a real 28-day activity grid from the velocity endpoint (lessons completed per day)
  const velocityByDay: Record<string, number> = {};
  (velocity ?? []).forEach((v: any) => {
    const key = new Date(v.day).toDateString();
    velocityByDay[key] = Number(v.count);
  });
  const maxCount = Math.max(1, ...Object.values(velocityByDay));
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    return { date: d, count: velocityByDay[d.toDateString()] ?? 0 };
  });

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="student" />

      <main className="flex-1 overflow-auto">
        <div className="border-b border-border px-8 py-5">
          <h1 className="text-2xl font-bold">
            Bienvenue, <span className="text-primary">{user?.fullName?.split(' ')[0] ?? ''}</span>
          </h1>
          <p className="text-text-muted text-sm mt-0.5">Reprenez là où vous vous êtes arrêté.</p>
        </div>

        <div className="p-8 space-y-8">
          {/* In Progress */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                EN COURS
              </h2>
              <Link href="/dashboard/student/courses" className="text-xs text-primary hover:underline">Voir tout</Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {inProgress.length === 0 ? (
                <div className="col-span-2 rounded-xl border border-dashed border-border bg-surface/70 p-6 text-sm text-text-muted">
                  Inscrivez-vous à une formation pour voir votre parcours actif ici.
                </div>
              ) : (
                inProgress.slice(0, 4).map((e: any) => (
                  <EnrollmentCard key={e.id} enrollment={e} />
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">CERTIFICATS</h3>
                <Award size={16} className="text-primary" />
              </div>
              <div className="space-y-3">
                {(certificates ?? []).length === 0 ? (
                  <p className="text-xs text-text-muted">Terminez une formation pour obtenir votre premier certificat.</p>
                ) : (
                  (certificates ?? []).slice(0, 3).map((c: any) => (
                    <div key={c.id} className="p-3 rounded-xl bg-surface border border-border">
                      <div className="text-sm font-medium mb-1 truncate">{c.course?.title ?? 'Certificat'}</div>
                      <div className="text-xs text-text-muted">
                        {c.issuedAt ? new Date(c.issuedAt).toLocaleDateString('fr-FR') : ''}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="col-span-2 card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap size={16} className="text-primary" /> Activité d'apprentissage
                </h3>
              </div>
              <div className="grid grid-cols-7 gap-1.5 mb-3">
                {days.map((d, i) => {
                  const ratio = d.count / maxCount;
                  return (
                    <div
                      key={i}
                      title={`${d.date.toLocaleDateString('fr-FR')}: ${d.count} leçon(s)`}
                      className="h-7 rounded"
                      style={{
                        background: d.count === 0
                          ? 'rgba(42,42,69,0.5)'
                          : ratio > 0.7
                          ? 'rgba(108,71,255,0.8)'
                          : ratio > 0.4
                          ? 'rgba(108,71,255,0.4)'
                          : 'rgba(108,71,255,0.15)',
                      }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-text-muted">
                <span>Il y a 4 semaines</span>
                <span>Cette semaine</span>
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
  const progress = enrollment.progressPercent ?? 0;

  return (
    <div className="card hover:border-primary/40 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-xs text-text-muted mb-1">{course.tags?.[0] ?? ''} {course.level ? `• ${course.level}` : ''}</div>
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
          {course.instructor?.fullName ?? ''} {course.tags?.length ? `· ${course.tags.join(' · ')}` : ''}
        </div>
        <Link href={`/courses/${course.id}`} className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium">
          Continuer <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
