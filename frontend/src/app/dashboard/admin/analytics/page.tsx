'use client';
import { useQuery } from '@tanstack/react-query';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { usersApi } from '@/lib/api';
import { formatDZD } from '@/lib/currency';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => usersApi.getAdminOverview().then((r) => r.data),
  });

  const topCourses = overview?.topCourses ?? [];
  const maxStudents = Math.max(1, ...topCourses.map((c: any) => c.studentCount));

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="admin" />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border px-8 py-5">
          <h1 className="text-xl font-bold">Statistiques</h1>
          <p className="text-text-muted text-sm">Chiffres réels calculés directement depuis la base de données</p>
        </div>

        <div className="p-8 space-y-6">
          {isLoading ? (
            <div className="card h-40 animate-pulse" />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <StatCard icon={<Users size={20} />} label="Utilisateurs" value={overview?.totalUsers ?? 0} />
                <StatCard icon={<BookOpen size={20} />} label="Formations (publiées / brouillon)" value={`${overview?.publishedCourses ?? 0} / ${overview?.draftCourses ?? 0}`} />
                <StatCard icon={<TrendingUp size={20} />} label="Chiffre d'affaires" value={formatDZD(overview?.totalRevenue ?? 0)} />
                <StatCard icon={<Award size={20} />} label="Certificats délivrés" value={overview?.totalCertificates ?? 0} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="card text-center">
                  <div className="text-3xl font-bold">{overview?.totalStudents ?? 0}</div>
                  <div className="text-text-muted text-sm mt-1">Étudiants</div>
                </div>
                <div className="card text-center">
                  <div className="text-3xl font-bold">{overview?.totalInstructors ?? 0}</div>
                  <div className="text-text-muted text-sm mt-1">Formateurs</div>
                </div>
                <div className="card text-center">
                  <div className="text-3xl font-bold">{overview?.totalEnrollments ?? 0}</div>
                  <div className="text-text-muted text-sm mt-1">Inscriptions ({overview?.completedEnrollments ?? 0} terminées)</div>
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-6">Formations les plus suivies</h3>
                {topCourses.length === 0 ? (
                  <p className="text-sm text-text-muted">Pas encore assez de données.</p>
                ) : (
                  <div className="space-y-4">
                    {topCourses.map((c: any) => (
                      <div key={c.id}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="font-medium">{c.title}</span>
                          <span className="text-text-muted">{c.studentCount} étudiants</span>
                        </div>
                        <div className="h-2 bg-surface rounded-full">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${Math.max(4, (c.studentCount / maxStudents) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="card">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-text-muted text-sm">{label}</div>
    </div>
  );
}
