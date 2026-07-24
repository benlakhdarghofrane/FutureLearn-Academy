'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Trash2, Clock, GripVertical } from 'lucide-react';

interface Props {
  courseId: string;
}

export function LessonManager({ courseId }: Props) {
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState(10);
  const [isFree, setIsFree] = useState(false);
  const [content, setContent] = useState('');

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => lessonsApi.getByCourse(courseId).then((r) => r.data),
    enabled: !!courseId,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      lessonsApi.create(courseId, {
        title,
        duration: Math.max(0, Math.round(minutes * 60)),
        isFree,
        content: content || undefined,
        order: lessons?.length ?? 0,
      }),
    onSuccess: () => {
      toast.success('Leçon ajoutée');
      setTitle('');
      setMinutes(10);
      setIsFree(false);
      setContent('');
      qc.invalidateQueries({ queryKey: ['lessons', courseId] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Impossible d'ajouter la leçon"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => lessonsApi.delete(courseId, id),
    onSuccess: () => {
      toast.success('Leçon supprimée');
      qc.invalidateQueries({ queryKey: ['lessons', courseId] });
    },
  });

  return (
    <div className="card space-y-5">
      <h3 className="font-semibold text-sm text-text-muted uppercase tracking-wider">Leçons</h3>

      {isLoading ? (
        <div className="h-16 animate-pulse bg-surface rounded-lg" />
      ) : (
        <div className="space-y-2">
          {(lessons ?? []).length === 0 && (
            <p className="text-sm text-text-muted">Aucune leçon pour le moment. Ajoutez-en une ci-dessous.</p>
          )}
          {(lessons ?? []).map((l: any, i: number) => (
            <div key={l.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border">
              <GripVertical size={14} className="text-text-muted flex-shrink-0" />
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{l.title}</div>
                <div className="text-xs text-text-muted flex items-center gap-2">
                  <span className="flex items-center gap-1"><Clock size={10} /> {Math.round((l.duration ?? 0) / 60)} min</span>
                  {l.isFree && <span className="badge-green badge">Aperçu gratuit</span>}
                </div>
              </div>
              <button
                onClick={() => confirm('Supprimer cette leçon ?') && deleteMutation.mutate(l.id)}
                className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-text-secondary hover:text-red-400 hover:border-red-500/30 transition-colors flex-shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-border pt-4 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input col-span-2"
            placeholder="Titre de la leçon"
          />
          <input
            type="number"
            min={1}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="input"
            placeholder="Durée (min)"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          className="input resize-none"
          placeholder="Contenu / notes de la leçon (optionnel)"
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="h-4 w-4 rounded border-border bg-background" />
            Aperçu gratuit (accessible sans inscription)
          </label>
          <button
            type="button"
            disabled={!title.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate()}
            className="btn-outline flex items-center gap-1.5 text-sm px-4"
          >
            <Plus size={14} /> Ajouter la leçon
          </button>
        </div>
      </div>
    </div>
  );
}
