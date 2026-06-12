'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { coursesApi, enrollmentsApi, progressApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import {
  Play, CheckCircle, Lock, Clock, Users,
  BookOpen, FileText, HelpCircle, ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'qa'>('notes');

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesApi.getOne(id).then((r) => r.data),
  });

  const enrollMutation = useMutation({
    mutationFn: () => enrollmentsApi.enroll(id),
    onSuccess: () => toast.success('Enrolled successfully!'),
    onError: (err: any) => toast.error(err.response?.data?.message || 'Already enrolled'),
  });

  const completeMutation = useMutation({
    mutationFn: (lessonId: string) => progressApi.complete(lessonId),
    onSuccess: () => toast.success('Lesson marked complete!'),
  });

  if (isLoading) return <LoadingScreen />;

  const c = course ?? MOCK_COURSE;
  const currentLesson = activeLesson ?? c.lessons?.[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16 flex h-[calc(100vh-4rem)]">
        {/* Sidebar: Lesson List */}
        <aside className="w-80 border-r border-border overflow-y-auto bg-surface flex-shrink-0">
          <div className="p-5 border-b border-border">
            <div className="text-xs text-text-muted mb-1">{c.tags?.join(' · ')}</div>
            <h2 className="font-bold text-base leading-tight">{c.title}</h2>
            <div className="mt-2 h-1 bg-background rounded-full">
              <div className="h-full bg-primary rounded-full" style={{ width: '45%' }} />
            </div>
            <div className="text-xs text-text-muted mt-1">45% complete</div>
          </div>

          <div className="p-3 space-y-1">
            {(c.lessons ?? MOCK_LESSONS).map((lesson: any, i: number) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${
                  currentLesson?.id === lesson.id
                    ? 'bg-primary/10 border border-primary/30'
                    : 'hover:bg-card'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  lesson.isCompleted
                    ? 'bg-accent-green/20 text-accent-green'
                    : currentLesson?.id === lesson.id
                    ? 'bg-primary/20 text-primary'
                    : 'bg-surface border border-border text-text-muted'
                }`}>
                  {lesson.isCompleted ? <CheckCircle size={14} /> : i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-medium truncate ${
                    currentLesson?.id === lesson.id ? 'text-white' : 'text-text-secondary'
                  }`}>
                    {lesson.title}
                  </div>
                  <div className="text-xs text-text-muted flex items-center gap-1">
                    <Clock size={10} /> {Math.floor((lesson.duration ?? 600) / 60)}m
                  </div>
                </div>
                {!lesson.isFree && !isAuthenticated && (
                  <Lock size={12} className="text-text-muted flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Main: Video + Tabs */}
        <main className="flex-1 overflow-y-auto">
          {/* Video Player */}
          <div className="bg-black aspect-video w-full relative group">
            {currentLesson?.videoUrl ? (
              <video
                key={currentLesson.id}
                src={currentLesson.videoUrl}
                controls
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface to-background">
                <button className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center hover:bg-primary/30 transition-colors group-hover:scale-110 duration-300">
                  <Play size={24} fill="white" className="text-white ml-1" />
                </button>
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-xs text-text-muted mb-1 font-mono">
                  {c.title} — {currentLesson?.title}
                </div>
                <h1 className="text-2xl font-bold">{currentLesson?.title ?? 'React Server Components In-Depth'}</h1>
              </div>
              <button
                onClick={() => currentLesson && completeMutation.mutate(currentLesson.id)}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <CheckCircle size={15} /> Mark Complete
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-6 flex gap-6">
              {(['notes', 'resources', 'qa'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'border-primary text-white'
                      : 'border-transparent text-text-muted hover:text-white'
                  }`}
                >
                  {tab === 'qa' ? 'Q&A' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'notes' && (
              <div className="prose prose-invert max-w-none">
                <h3 className="text-white font-semibold mb-3">Understanding the RSC Payload</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  React Server Components do not return HTML. They return a specialized format called the RSC Payload.
                  This allows Next.js to seamlessly merge server-rendered tree with client-side data.
                </p>
                <div className="bg-surface rounded-xl border border-border p-4 font-mono text-xs text-text-secondary overflow-x-auto">
                  <div className="text-accent-blue">{'// Server Component'}</div>
                  <div>{'async function '}<span className="text-primary">UserList</span>{'() {'}</div>
                  <div className="pl-4">{'const data = await '}<span className="text-accent-cyan">fetch</span>{'(\'/api/users\');'}</div>
                  <div className="pl-4">{'const users = await data.'}<span className="text-accent-green">json</span>{'();'}</div>
                  <div className="pl-4">{'return '}<span className="text-yellow-400">{'<ul>'}</span>{'{ users.map(u => '}<span className="text-yellow-400">{'<li>'}</span>{'{u.name}'}<span className="text-yellow-400">{'</li>'}</span>{') }'}<span className="text-yellow-400">{'</ul>'}</span>;</div>
                  <div>{'}'}</div>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3">
                {['Course Slides — Module 3.pdf', 'Starter Boilerplate.zip', 'Streaming with Suspense.md'].map((r) => (
                  <div key={r} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border hover:border-primary/40 transition-colors cursor-pointer">
                    <FileText size={16} className="text-primary flex-shrink-0" />
                    <span className="text-sm text-text-secondary">{r}</span>
                    <ChevronRight size={14} className="text-text-muted ml-auto" />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border">
                  <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm mb-1">Stuck on an error?</div>
                    <div className="text-text-muted text-xs">Paste your code or error here to find it faster in the thread.</div>
                    <button className="mt-2 text-xs text-primary hover:underline">Open in Mentor</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        <div className="text-text-muted text-sm">Loading course...</div>
      </div>
    </div>
  );
}

const MOCK_COURSE = {
  id: '1',
  title: 'Full-Stack Web Development Mastery',
  tags: ['React', 'Node.js', 'PostgreSQL'],
  lessons: MOCK_LESSONS,
};

const MOCK_LESSONS = [
  { id: '1', title: 'Introduction to RSC', duration: 720, isFree: true, isCompleted: true },
  { id: '2', title: 'React Server Components In-Depth', duration: 1800, isFree: false, isCompleted: false },
  { id: '3', title: 'Streaming & Suspense Boundaries', duration: 1500, isFree: false, isCompleted: false },
  { id: '4', title: 'Server Actions Deep Dive', duration: 2100, isFree: false, isCompleted: false },
  { id: '5', title: 'Database Integration with Prisma', duration: 1800, isFree: false, isCompleted: false },
];
