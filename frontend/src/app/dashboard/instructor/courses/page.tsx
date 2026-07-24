'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { coursesApi } from '@/lib/api';
import { formatDZD } from '@/lib/currency';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Users, BookOpen, Eye } from 'lucide-react';

export default function InstructorCoursesPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: () => coursesApi.getMy().then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => coursesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-courses'] });
      toast.success('Course deleted');
    },
  });

  const list = courses ?? [];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="instructor" />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">My Courses</h1>
            <p className="text-text-muted text-sm">{list.length} courses published</p>
          </div>
          <Link href="/dashboard/instructor/courses/new" className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> New Course
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
              Vous n'avez pas encore de formation. <Link href="/dashboard/instructor/courses/new" className="text-primary hover:underline">Créez-en une maintenant</Link>.
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
                    <div className="flex items-center gap-4 text-xs text-text-muted mt-1">
                      <span className="flex items-center gap-1"><Users size={11} /> {course.enrollments?.length ?? 0} students</span>
                      <span className="flex items-center gap-1"><BookOpen size={11} /> {course.lessons?.length ?? 0} lessons</span>
                      <span className="text-primary font-medium">{formatDZD(course.price)}</span>
                      <span className={`badge ${course.isPublished !== false ? 'badge-green' : 'bg-border text-text-muted badge'}`}>
                        {course.isPublished !== false ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/courses/${course.id}`} className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-white hover:border-primary/50 transition-colors">
                      <Eye size={15} />
                    </Link>
                    <Link href={`/dashboard/instructor/courses/${course.id}/edit`} className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-white hover:border-primary/50 transition-colors">
                      <Edit2 size={15} />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Delete this course?')) deleteMutation.mutate(course.id);
                      }}
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
