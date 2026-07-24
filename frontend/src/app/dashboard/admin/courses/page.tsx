'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { coursesApi } from '@/lib/api';
import { formatDZD } from '@/lib/currency';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Users, BookOpen, Eye, CheckCircle, EyeOff } from 'lucide-react';

export default function AdminCoursesPage() {
  const qc = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => coursesApi.getAllAdmin().then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => coursesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Formation supprimée');
    },
    onError: () => toast.error('Échec de la suppression'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isPublished }: any) => coursesApi.update(id, { isPublished }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Statut mis à jour');
    },
  });

  const list = courses ?? [];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="admin" />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Toutes les formations</h1>
            <p className="text-text-muted text-sm">{list.length} formations sur la plateforme</p>
          </div>
          <Link href="/dashboard/admin/courses/new" className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> Nouvelle formation
          </Link>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card h-20 animate-pulse bg-surface" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="card text-center py-16 text-text-muted">
              Aucune formation sur la plateforme pour le moment.
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((course: any) => (
                <div key={course.id} className="card flex items-center gap-5 hover:border-primary/40 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                    {course.title?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{course.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-text-muted mt-1 flex-wrap">
                      <span>{course.instructor?.fullName ?? 'Sans formateur'}</span>
                      <span className="flex items-center gap-1"><Users size={11} /> {course.enrollments?.length ?? 0} étudiants</span>
                      <span className="text-primary font-medium">{formatDZD(course.price)}</span>
                      <span className={`badge ${course.isPublished ? 'badge-green' : 'bg-border text-text-muted badge'}`}>
                        {course.isPublished ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleMutation.mutate({ id: course.id, isPublished: !course.isPublished })}
                      title={course.isPublished ? 'Dépublier' : 'Publier'}
                      className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-white hover:border-primary/50 transition-colors"
                    >
                      {course.isPublished ? <EyeOff size={15} /> : <CheckCircle size={15} />}
                    </button>
                    <Link href={`/courses/${course.id}`} className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-white hover:border-primary/50 transition-colors">
                      <Eye size={15} />
                    </Link>
                    <Link href={`/dashboard/admin/courses/${course.id}/edit`} className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-white hover:border-primary/50 transition-colors">
                      <Edit2 size={15} />
                    </Link>
                    <button
                      onClick={() => confirm('Supprimer cette formation ?') && deleteMutation.mutate(course.id)}
                      className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-red-400 hover:border-red-500/30 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
