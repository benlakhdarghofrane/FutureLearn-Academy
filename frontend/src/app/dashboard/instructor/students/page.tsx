'use client';
import { useQuery } from '@tanstack/react-query';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { coursesApi } from '@/lib/api';
import { Users } from 'lucide-react';

export default function InstructorStudentsPage() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () => coursesApi.getMy().then((r) => r.data),
  });

  const rows =
    (courses ?? []).flatMap((course: any) =>
      (course.enrollments ?? []).map((e: any) => ({
        courseTitle: course.title,
        studentName: e.user?.fullName ?? 'Étudiant',
        studentEmail: e.user?.email ?? '—',
        progress: e.progressPercent ?? 0,
        isCompleted: e.isCompleted,
        enrolledAt: e.enrolledAt,
      })),
    ) ?? [];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="instructor" />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border px-8 py-5">
          <h1 className="text-xl font-bold">Étudiants</h1>
          <p className="text-text-muted text-sm">{rows.length} inscriptions au total, toutes formations confondues</p>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="card h-40 animate-pulse" />
          ) : rows.length === 0 ? (
            <div className="card text-center py-16 text-text-muted flex flex-col items-center gap-3">
              <Users size={28} />
              Aucun étudiant inscrit pour le moment.
            </div>
          ) : (
            <div className="card overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">Étudiant</th>
                    <th className="text-left px-5 py-3">Formation</th>
                    <th className="text-left px-5 py-3">Progression</th>
                    <th className="text-left px-5 py-3">Inscrit le</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-surface transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-medium">{r.studentName}</div>
                        <div className="text-xs text-text-muted">{r.studentEmail}</div>
                      </td>
                      <td className="px-5 py-3 text-text-secondary">{r.courseTitle}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-surface rounded-full">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${r.progress}%` }} />
                          </div>
                          <span className="text-xs text-text-muted">{r.progress}%</span>
                          {r.isCompleted && <span className="badge badge-green">Terminé</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-text-muted text-xs">
                        {r.enrolledAt ? new Date(r.enrolledAt).toLocaleDateString('fr-FR') : '—'}
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
