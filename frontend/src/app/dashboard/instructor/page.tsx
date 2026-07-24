'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { useAuthStore } from '@/lib/store';
import { coursesApi, usersApi } from '@/lib/api';
import { formatDZD } from '@/lib/currency';
import { Plus, TrendingUp, BookOpen, Users, Award } from 'lucide-react';

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

  const totalStudents = stats?.totalStudents ?? 0;
  const activeCourses = stats?.activeCourses ?? courses?.length ?? 0;
  const completionRate = Math.round(stats?.averageCompletionRate ?? 0);

  const coursesByEnrollment = [...(courses ?? [])].sort(
    (a: any, b: any) => (b.enrollments?.length ?? 0) - (a.enrollments?.length ?? 0),
  );
  const maxEnrollments = Math.max(1, ...coursesByEnrollment.map((c: any) => c.enrollments?.length ?? 0));

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="instructor" />

      <main className="flex-1 overflow-auto">
        <div className="border-b border-border px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Bonjour, <span className="text-primary">{user?.fullName?.split(' ')[0] || 'Formateur'}</span>
            </h1>
            <p className="text-text-muted text-sm mt-0.5">Voici ce qui se passe sur vos formations aujourd'hui.</p>
          </div>
          <Link href="/dashboard/instructor/courses/new" className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Créer une formation
          </Link>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-5 mb-8">
            <StatCard label="Étudiants inscrits" value={totalStudents.toLocaleString()} icon={<Users size={20} />} color="blue" />
            <StatCard label="Formations" value={activeCourses} icon={<BookOpen size={20} />} color="purple" />
            <StatCard label="Taux de complétion" value={`${completionRate}%`} icon={<Award size={20} />} color="orange" />
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Inscriptions par formation</h3>
              </div>
              {coursesByEnrollment.length > 0 ? (
                <div className="h-40 flex items-end gap-3">
                  {coursesByEnrollment.slice(0, 8).map((c: any) => {
                    const count = c.enrollments?.length ?? 0;
                    return (
                      <div key={c.id} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-full flex items-end h-32">
                          <div
                            className="w-full rounded-t bg-primary/40 hover:bg-primary/60 transition-colors"
                            style={{ height: `${Math.max(4, (count / maxEnrollments) * 100)}%` }}
                            title={`${c.title}: ${count}`}
                          />
                        </div>
                        <div className="text-xs text-text-muted">{count}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-text-muted text-sm">
                  Pas encore de données d'inscription.
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">Mes formations</h3>
              <div className="space-y-3">
                {(!courses || courses.length === 0) && (
                  <div className="rounded-lg border border-dashed border-border bg-surface/70 p-3 text-sm text-text-muted">
                    Créez votre première formation pour remplir cette section.
                  </div>
                )}
                {(courses ?? []).slice(0, 4).map((c: any) => (
                  <Link key={c.id} href={`/dashboard/instructor/courses/${c.id}/edit`}>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                        {c.title?.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{c.title}</div>
                        <div className="text-xs text-text-muted">{c.enrollments?.length ?? 0} étudiants · {formatDZD(c.price)}</div>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link href="/dashboard/instructor/courses/new" className="flex items-center gap-2 text-xs text-primary hover:underline mt-2">
                  <Plus size={14} /> Ajouter une formation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
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
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-text-muted text-sm">{label}</div>
    </div>
  );
}
