'use client';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { coursesApi, enrollmentsApi, progressApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatDZD } from '@/lib/currency';
import { toast } from 'sonner';
import {
  Play, CheckCircle, Lock, Clock, Users, FileText,
} from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeLesson, setActiveLesson] = useState<any>(null);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesApi.getOne(id).then((r) => r.data),
    retry: false,
  });

  const { data: myEnrollments } = useQuery({
    queryKey: ['enrollments', 'my'],
    queryFn: () => enrollmentsApi.getMy().then((r) => r.data),
    enabled: isAuthenticated,
  });

  const { data: myProgress } = useQuery({
    queryKey: ['progress', 'my'],
    queryFn: () => progressApi.getMy().then((r) => r.data),
    enabled: isAuthenticated,
  });

  const isEnrolled = useMemo(
    () => Boolean(myEnrollments?.some((e: any) => e.courseId === id)),
    [myEnrollments, id],
  );

  const completedLessonIds = useMemo(
    () => new Set((myProgress ?? []).filter((p: any) => p.isCompleted).map((p: any) => p.lessonId)),
    [myProgress],
  );

  const enrollMutation = useMutation({
    mutationFn: () => enrollmentsApi.enroll(id),
    onSuccess: () => {
      toast.success('Inscription réussie !');
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'my'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Impossible de s'inscrire"),
  });

  const completeMutation = useMutation({
    mutationFn: (lessonId: string) => progressApi.complete(lessonId),
    onSuccess: () => {
      toast.success('Leçon marquée comme terminée !');
      queryClient.invalidateQueries({ queryKey: ['progress', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'my'] });
    },
  });

  if (isLoading) return <LoadingScreen />;

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center text-text-muted">Formation introuvable.</div>
        <Footer />
      </div>
    );
  }

  const lessons = course.lessons ?? [];
  const currentLesson = activeLesson ?? lessons[0] ?? null;
  const canAccessLesson = (lesson: any) => lesson?.isFree || isEnrolled;
  const canWatchCurrent = canAccessLesson(currentLesson);
  const enrollment = myEnrollments?.find((e: any) => e.courseId === id);
  const progressPercent = enrollment?.progressPercent ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16 flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        {/* Sidebar: Lesson List */}
        <aside className="w-full lg:w-80 border-r border-border overflow-y-auto bg-surface flex-shrink-0">
          <div className="p-5 border-b border-border">
            <div className="text-xs text-text-muted mb-1">{course.tags?.join(' · ')}</div>
            <h2 className="font-bold text-base leading-tight">{course.title}</h2>
            <div className="mt-3 text-lg font-bold text-primary">{formatDZD(course.price)}</div>
            {isAuthenticated ? (
              isEnrolled ? (
                <>
                  <div className="mt-3 h-1 bg-background rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div className="text-xs text-text-muted mt-1">{progressPercent}% terminé</div>
                </>
              ) : (
                <button
                  onClick={() => enrollMutation.mutate()}
                  disabled={enrollMutation.isPending}
                  className="btn-primary w-full mt-3 py-2.5 text-sm"
                >
                  {enrollMutation.isPending ? 'Inscription...' : "S'inscrire à cette formation"}
                </button>
              )
            ) : (
              <a href="/login" className="btn-primary w-full mt-3 py-2.5 text-sm inline-block text-center">
                Se connecter pour s'inscrire
              </a>
            )}
          </div>

          <div className="p-3 space-y-1">
            {lessons.map((lesson: any, i: number) => {
              const unlocked = canAccessLesson(lesson);
              const completed = completedLessonIds.has(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => unlocked && setActiveLesson(lesson)}
                  disabled={!unlocked}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${
                    currentLesson?.id === lesson.id
                      ? 'bg-primary/10 border border-primary/30'
                      : unlocked ? 'hover:bg-card' : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    completed
                      ? 'bg-accent-green/20 text-accent-green'
                      : currentLesson?.id === lesson.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-surface border border-border text-text-muted'
                  }`}>
                    {completed ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-medium truncate ${
                      currentLesson?.id === lesson.id ? 'text-white' : 'text-text-secondary'
                    }`}>
                      {lesson.title}
                    </div>
                    <div className="text-xs text-text-muted flex items-center gap-1">
                      <Clock size={10} /> {Math.floor((lesson.duration ?? 0) / 60)}m
                    </div>
                  </div>
                  {!unlocked && <Lock size={12} className="text-text-muted flex-shrink-0" />}
                </button>
              );
            })}
            {lessons.length === 0 && (
              <div className="text-sm text-text-muted p-4 text-center">
                Aucune leçon publiée pour cette formation pour le moment.
              </div>
            )}
          </div>
        </aside>

        {/* Main: Video + Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="bg-black aspect-video w-full relative group">
            {currentLesson && canWatchCurrent && currentLesson.videoUrl ? (
              <video key={currentLesson.id} src={currentLesson.videoUrl} controls className="w-full h-full" />
            ) : currentLesson && !canWatchCurrent ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface to-background gap-3">
                <Lock size={28} className="text-text-muted" />
                <p className="text-sm text-text-muted">Inscrivez-vous pour débloquer cette leçon.</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface to-background">
                <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <Play size={24} fill="white" className="text-white ml-1" />
                </div>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
              <div>
                <div className="text-xs text-text-muted mb-1 font-mono">
                  {course.title} {currentLesson ? `— ${currentLesson.title}` : ''}
                </div>
                <h1 className="text-2xl font-bold">{currentLesson?.title ?? course.title}</h1>
                <p className="text-sm text-text-muted mt-2 max-w-2xl">
                  {currentLesson?.description || course.description}
                </p>
              </div>
              {currentLesson && canWatchCurrent && (
                <button
                  onClick={() => completeMutation.mutate(currentLesson.id)}
                  disabled={completeMutation.isPending || completedLessonIds.has(currentLesson.id)}
                  className="btn-primary flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  <CheckCircle size={15} />
                  {completedLessonIds.has(currentLesson.id) ? 'Terminée' : 'Marquer comme terminée'}
                </button>
              )}
            </div>

            {currentLesson?.content && canWatchCurrent && (
              <div className="prose prose-invert max-w-none mb-6">
                <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                  {currentLesson.content}
                </div>
              </div>
            )}

            {currentLesson?.resources?.length > 0 && canWatchCurrent && (
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-sm mb-2">Ressources</h3>
                {currentLesson.resources.map((r: string) => (
                  <a
                    key={r}
                    href={r}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border hover:border-primary/40 transition-colors"
                  >
                    <FileText size={16} className="text-primary flex-shrink-0" />
                    <span className="text-sm text-text-secondary truncate">{r}</span>
                  </a>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-text-muted mt-8 pt-6 border-t border-border">
              <span className="flex items-center gap-1"><Clock size={12} /> {course.durationWeeks} semaines</span>
              <span className="flex items-center gap-1"><Users size={12} /> {course.enrollments?.length ?? 0} inscrits</span>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        <div className="text-text-muted text-sm">Chargement de la formation...</div>
      </div>
    </div>
  );
}
