'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { usersApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import { Search, Trash2, Users as UsersIcon } from 'lucide-react';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => usersApi.getAll().then((r) => r.data),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: any) => usersApi.updateAsAdmin(id, { role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['all-users'] });
      toast.success('Rôle mis à jour');
    },
    onError: () => toast.error('Échec de la mise à jour du rôle'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['all-users'] });
      toast.success('Utilisateur supprimé');
    },
    onError: () => toast.error('Échec de la suppression'),
  });

  const list = (users ?? []).filter((u: any) => {
    const matchesSearch = !search || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const counts = {
    total: (users ?? []).length,
    student: (users ?? []).filter((u: any) => u.role === 'student').length,
    instructor: (users ?? []).filter((u: any) => u.role === 'instructor').length,
    admin: (users ?? []).filter((u: any) => u.role === 'admin').length,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="admin" />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border px-8 py-5">
          <h1 className="text-xl font-bold">Utilisateurs</h1>
          <p className="text-text-muted text-sm">{counts.total} comptes · {counts.student} étudiants · {counts.instructor} formateurs · {counts.admin} admins</p>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" placeholder="Rechercher par nom ou e-mail..." />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input md:w-48">
              <option value="all">Tous les rôles</option>
              <option value="student">Étudiants</option>
              <option value="instructor">Formateurs</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {isLoading ? (
            <div className="card h-40 animate-pulse" />
          ) : list.length === 0 ? (
            <div className="card text-center py-16 text-text-muted flex flex-col items-center gap-3">
              <UsersIcon size={28} />
              Aucun utilisateur ne correspond à votre recherche.
            </div>
          ) : (
            <div className="card overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Utilisateur</th>
                    <th className="text-left px-5 py-3">Rôle</th>
                    <th className="text-left px-5 py-3">Inscrit le</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((u: any) => (
                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-medium">{u.fullName}</div>
                        <div className="text-xs text-text-muted">{u.email}</div>
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={u.role}
                          disabled={u.id === currentUser?.id}
                          onChange={(e) => roleMutation.mutate({ id: u.id, role: e.target.value })}
                          className="bg-surface border border-border rounded-lg px-2 py-1 text-xs text-text-secondary disabled:opacity-50"
                        >
                          <option value="student">student</option>
                          <option value="instructor">instructor</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-5 py-3 text-text-muted text-xs">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          disabled={u.id === currentUser?.id}
                          onClick={() => confirm(`Supprimer ${u.fullName} ?`) && deleteMutation.mutate(u.id)}
                          className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-red-400 hover:border-red-500/30 transition-colors disabled:opacity-30"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
