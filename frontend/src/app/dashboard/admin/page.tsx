'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { Users, BookOpen, BarChart3, Settings, AlertCircle, Award } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { usersApi } from '@/lib/api';
import { formatDZD } from '@/lib/currency';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const { data: overview, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => usersApi.getAdminOverview().then((r) => r.data),
    enabled: user?.role === 'admin',
  });

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-text-muted mb-6">You don't have permission to access the admin panel.</p>
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Utilisateurs', value: overview?.totalUsers ?? 0, icon: <Users size={20} /> },
    { label: 'Formations publiées', value: overview?.publishedCourses ?? 0, icon: <BookOpen size={20} /> },
    { label: 'Chiffre d\'affaires', value: formatDZD(overview?.totalRevenue ?? 0), icon: <BarChart3 size={20} /> },
    { label: 'Certificats délivrés', value: overview?.totalCertificates ?? 0, icon: <Award size={20} /> },
  ];

  const quickActions = [
    { title: 'Gérer les formations', description: 'Créer, modifier ou supprimer des formations', href: '/dashboard/admin/courses', icon: <BookOpen size={20} /> },
    { title: 'Gérer les utilisateurs', description: 'Voir et gérer les comptes utilisateurs', href: '/dashboard/admin/users', icon: <Users size={20} /> },
    { title: 'Statistiques', description: 'Voir les statistiques réelles de la plateforme', href: '/dashboard/admin/analytics', icon: <BarChart3 size={20} /> },
    { title: 'Contenu du site', description: 'Modifier la page d\'accueil et les textes', href: '/dashboard/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="admin" />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Tableau de bord Admin</h1>
            <p className="text-text-muted">Vue d'ensemble réelle de la plateforme.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-text-muted text-sm mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{isLoading ? '—' : stat.value}</div>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group card hover:border-primary/40 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary/20 transition-colors">
                    {action.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-xs text-text-muted">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Utilisateurs récents</h2>
              <div className="space-y-3">
                {(overview?.recentUsers ?? []).length === 0 && (
                  <p className="text-sm text-text-muted">Aucun utilisateur pour le moment.</p>
                )}
                {(overview?.recentUsers ?? []).map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                    <div>
                      <div className="text-sm font-medium">{u.fullName}</div>
                      <div className="text-xs text-text-muted capitalize">{u.role} · {u.email}</div>
                    </div>
                    <div className="text-xs text-text-muted">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-bold mb-4">Formations les plus populaires</h2>
              <div className="space-y-3">
                {(overview?.topCourses ?? []).length === 0 && (
                  <p className="text-sm text-text-muted">Aucune formation pour le moment.</p>
                )}
                {(overview?.topCourses ?? []).map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                    <div>
                      <div className="text-sm font-medium">{c.title}</div>
                      <div className="text-xs text-text-muted">{c.instructorName} · {formatDZD(c.price)}</div>
                    </div>
                    <div className="text-xs text-text-muted">{c.studentCount} étudiants</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
