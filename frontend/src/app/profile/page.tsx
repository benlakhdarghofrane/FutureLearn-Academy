'use client';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { useAuthStore } from '@/lib/store';
import { authApi, certificatesApi, enrollmentsApi, usersApi } from '@/lib/api';
import { toast } from 'sonner';
import { Edit2, Save, Plus, X, Award, Code2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [title, setTitle] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  const role = (user?.role as 'student' | 'instructor' | 'admin') || 'student';

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.me().then((r) => r.data),
  });

  const { data: certs } = useQuery({
    queryKey: ['my-certs'],
    queryFn: () => certificatesApi.getMy().then((r) => r.data),
  });

  const { data: enrollments } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentsApi.getMy().then((r) => r.data),
    enabled: role === 'student',
  });

  useEffect(() => {
    if (profile) {
      setBio(profile.bio ?? '');
      setTitle(profile.title ?? '');
      setTechStack(profile.techStack ?? []);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => usersApi.updateMe(data),
    onSuccess: (res) => {
      setUser(res.data);
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profil mis à jour');
      setEditing(false);
    },
    onError: () => toast.error('Échec de la mise à jour'),
  });

  const p = profile ?? user ?? {};

  const addTech = () => {
    const t = techInput.trim();
    if (t && !techStack.includes(t)) setTechStack([...techStack, t]);
    setTechInput('');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role={role} />

      <main className="flex-1 overflow-auto">
        <div className="border-b border-border px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Mon profil</h1>
            <p className="text-text-muted text-sm">Gérez votre identité et vos compétences.</p>
          </div>
          <div className="flex gap-3">
            {editing ? (
              <button
                onClick={() => updateMutation.mutate({ bio, title, techStack })}
                disabled={updateMutation.isPending}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Save size={14} /> Enregistrer
              </button>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-outline flex items-center gap-2 text-sm">
                <Edit2 size={14} /> Modifier le profil
              </button>
            )}
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Identity */}
          <div className="space-y-4">
            <div className="card text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent-blue/30 flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                {p.fullName?.charAt(0)}
              </div>
              <div className="font-bold text-lg">{p.fullName}</div>
              <div className="text-text-muted text-sm mb-1">{p.email}</div>
              <div className="text-text-muted text-xs capitalize mb-3">{role}</div>

              {editing ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input text-sm text-center"
                  placeholder="Titre (ex : Développeur Full-Stack)"
                />
              ) : (
                p.title && <div className="text-xs text-text-secondary">{p.title}</div>
              )}

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="font-semibold text-sm">{p.rank ?? 'Onyx'}</div>
                  <div className="text-text-muted text-xs">Rang</div>
                </div>
                <div>
                  <div className="font-semibold text-sm">{(p.xp ?? 0).toLocaleString()}</div>
                  <div className="text-text-muted text-xs">XP</div>
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' }) : '—'}
                  </div>
                  <div className="text-text-muted text-xs">Membre depuis</div>
                </div>
              </div>
            </div>

            <div className="card space-y-1">
              <Link
                href={role === 'admin' ? '/dashboard/admin' : role === 'instructor' ? '/dashboard/instructor' : '/dashboard/student'}
                className="sidebar-item"
              >
                <Code2 size={16} />
                <span className="text-sm">Tableau de bord</span>
              </Link>
              {role === 'student' && (
                <Link href="/dashboard/student/courses" className="sidebar-item">
                  <Award size={16} />
                  <span className="text-sm">Mes formations</span>
                </Link>
              )}
              {role === 'instructor' && (
                <Link href="/dashboard/instructor/courses" className="sidebar-item">
                  <Award size={16} />
                  <span className="text-sm">Mes formations</span>
                </Link>
              )}
            </div>

            <div className="card">
              <h3 className="font-semibold mb-3 text-sm">Bio</h3>
              {editing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="input resize-none text-sm"
                  placeholder="Parlez un peu de vous..."
                />
              ) : (
                <p className="text-sm text-text-secondary leading-relaxed">
                  {p.bio || 'Aucune bio pour le moment.'}
                </p>
              )}
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-2 space-y-5">
            {role === 'student' && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Code2 size={16} className="text-primary" /> Mes formations en cours
                  </h3>
                </div>
                <div className="space-y-3">
                  {(enrollments ?? []).filter((e: any) => !e.isCompleted).length === 0 && (
                    <p className="text-sm text-text-muted">Aucune formation en cours pour le moment.</p>
                  )}
                  {(enrollments ?? [])
                    .filter((e: any) => !e.isCompleted)
                    .map((e: any) => (
                      <div key={e.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium">{e.course?.title}</span>
                          <span className="text-xs text-primary">{e.progressPercent ?? 0}%</span>
                        </div>
                        <div className="h-1.5 bg-surface rounded-full">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent-blue"
                            style={{ width: `${e.progressPercent ?? 0}%` }}
                          />
                        </div>
                        <Link href={`/courses/${e.courseId}`} className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                          Continuer <ArrowRight size={10} />
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Code2 size={16} className="text-accent-blue" /> Compétences techniques
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {techStack.length === 0 && !editing && (
                    <p className="text-sm text-text-muted">Aucune compétence renseignée.</p>
                  )}
                  {techStack.map((t) => (
                    <span key={t} className="tag flex items-center gap-1.5">
                      {t}
                      {editing && (
                        <button onClick={() => setTechStack(techStack.filter((x) => x !== t))}>
                          <X size={10} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {editing && (
                  <div className="flex gap-2">
                    <input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                      className="input flex-1 text-sm"
                      placeholder="Ajouter une compétence..."
                    />
                    <button type="button" onClick={addTech} className="btn-outline flex items-center gap-1 text-sm px-3">
                      <Plus size={13} />
                    </button>
                  </div>
                )}
              </div>

              <div className="card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award size={16} className="text-accent-blue" /> Certificats
                </h3>
                <div className="space-y-3">
                  {(certs ?? []).length === 0 && (
                    <p className="text-sm text-text-muted">Terminez une formation pour obtenir un certificat.</p>
                  )}
                  {(certs ?? []).map((c: any) => (
                    <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Award size={14} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{c.course?.title}</div>
                        <div className="text-xs text-text-muted">
                          Délivré le {c.issuedAt ? new Date(c.issuedAt).toLocaleDateString('fr-FR') : ''} · {c.certificateNumber}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
