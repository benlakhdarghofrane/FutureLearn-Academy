'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { useAuthStore } from '@/lib/store';
import { authApi, certificatesApi, usersApi } from '@/lib/api';
import { toast } from 'sonner';
import {
  Edit2, Save, Plus, Shield, Globe, Key,
  Award, Code2, FolderGit2, ToggleRight,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.me().then((r) => r.data),
  });

  const { data: certs } = useQuery({
    queryKey: ['my-certs'],
    queryFn: () => certificatesApi.getMy().then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => usersApi.updateMe(data),
    onSuccess: (res) => {
      setUser(res.data);
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated');
      setEditing(false);
    },
  });

  const p = profile ?? MOCK_PROFILE;

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="student" />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-border px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Student Profile</h1>
            <p className="text-text-muted text-sm">Manage your identity, skills, and portfolio within the Academy ecosystem.</p>
          </div>
          <div className="flex gap-3">
            {editing ? (
              <button
                onClick={() => updateMutation.mutate({ bio: p.bio })}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Save size={14} /> Save Changes
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="btn-outline flex items-center gap-2 text-sm"
              >
                <Edit2 size={14} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="p-8 grid grid-cols-3 gap-6">
          {/* Left: Identity */}
          <div className="space-y-4">
            <div className="card text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent-blue/30 flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                {p.fullName?.charAt(0)}
              </div>
              <div className="font-bold text-lg">{p.fullName}</div>
              <div className="text-text-muted text-sm mb-3">{p.email}</div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-accent-green">
                <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                Online & Going
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="font-semibold text-sm">Onyx 11</div>
                  <div className="text-text-muted text-xs">Rank</div>
                </div>
                <div>
                  <div className="font-semibold text-sm">{(p.xp ?? 14290).toLocaleString()}</div>
                  <div className="text-text-muted text-xs">XP</div>
                </div>
                <div>
                  <div className="font-semibold text-sm">2021-04</div>
                  <div className="text-text-muted text-xs">Joined</div>
                </div>
              </div>
            </div>

            {/* Nav shortcuts */}
            <div className="card space-y-1">
              {[
                { icon: <Code2 size={16} />, label: 'Dashboard', href: '/dashboard/student' },
                { icon: <Award size={16} />, label: 'Courses', href: '/dashboard/student/courses' },
                { icon: <FolderGit2 size={16} />, label: 'Schedule', href: '#' },
                { icon: <Shield size={16} />, label: 'Settings', href: '#' },
              ].map((item) => (
                <a key={item.label} href={item.href} className="sidebar-item">
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div className="col-span-2 space-y-5">
            {/* Active Programs */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Code2 size={16} className="text-primary" /> Active Architecture Program
                </h3>
                <span className="text-xs text-text-muted">Phase 2/5</span>
              </div>
              <div className="space-y-3">
                {ACTIVE_PROGRAMS.map((prog) => (
                  <div key={prog.title}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium">{prog.title}</span>
                      <span className="text-xs text-primary">{prog.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-surface rounded-full">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent-blue"
                        style={{ width: `${prog.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-text-muted mt-1">Current Module: {prog.module}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack + Certifications */}
            <div className="grid grid-cols-2 gap-5">
              <div className="card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Code2 size={16} className="text-accent-blue" /> Technical Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {TECH_STACK.map((t) => (
                    <span key={t.name} className={`tag ${t.primary ? 'border-primary/50 text-primary' : ''}`}>
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Award size={16} className="text-accent-blue" /> Certifications
                </h3>
                <div className="space-y-3">
                  {(certs ?? MOCK_CERTS).map((c: any) => (
                    <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Award size={14} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{c.course?.title ?? c.title}</div>
                        <div className="text-xs text-text-muted">Issued: {c.issuedAt ? new Date(c.issuedAt).toLocaleDateString() : c.issued}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FolderGit2 size={16} className="text-accent-blue" /> My Portfolio
                </h3>
                <button className="text-xs text-primary hover:underline flex items-center gap-1">
                  <Plus size={12} /> Add Project
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {PORTFOLIO.map((proj) => (
                  <div key={proj.title} className="rounded-xl bg-surface border border-border p-4 hover:border-primary/40 transition-colors">
                    <div className="font-medium text-sm mb-1">{proj.title}</div>
                    <div className="flex flex-wrap gap-1">
                      {proj.tags.map((t) => (
                        <span key={t} className="text-xs text-text-muted">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="rounded-xl border border-dashed border-border flex items-center justify-center p-4 text-text-muted hover:border-primary/50 hover:text-primary transition-all">
                  <div className="text-center">
                    <Plus size={20} className="mx-auto mb-1" />
                    <span className="text-xs">Upload New Project</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Security */}
            <div className="card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield size={16} className="text-accent-blue" /> Account Security
              </h3>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-text-muted block mb-2">Public Profile URL</label>
                  <div className="input text-sm text-text-secondary">acmy.io/{p.publicProfileUrl ?? 'alex-mercer'}</div>
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-2">Privacy Controls</label>
                  <div className="space-y-2">
                    {PRIVACY.map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">{item.label}</span>
                        <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${item.on ? 'bg-primary' : 'bg-border'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${item.on ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-2 flex items-center gap-1">
                    <Key size={12} /> Authentication Key (2FA)
                  </label>
                  <div className="input text-sm font-mono text-text-muted tracking-widest">
                    ••••••••••••••••
                  </div>
                </div>
              </div>
              <button className="mt-4 btn-outline text-sm">Upgrade to Pro</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const MOCK_PROFILE = {
  fullName: 'Alex Mercer',
  email: 'alex.mkcd@sys.nu11',
  xp: 14290,
  publicProfileUrl: 'alex-mercer',
};

const ACTIVE_PROGRAMS = [
  { title: 'Distributed Systems Engineering', progress: 78, module: 'Consensus Algorithms in Rust' },
  { title: 'Advanced Cryptography', progress: 12, module: 'Zero-Knowledge Proofs' },
];

const TECH_STACK = [
  { name: 'Python', primary: false },
  { name: 'React.js', primary: true },
  { name: 'Rust', primary: false },
  { name: 'Svelto', primary: false },
  { name: 'GraphQL', primary: false },
  { name: 'Node.js', primary: false },
  { name: 'Redis', primary: false },
  { name: 'PostgreSQL', primary: false },
  { name: 'AWS', primary: false },
];

const MOCK_CERTS = [
  { id: '1', title: 'Backend Architecture Master', issued: '2023-10-15' },
  { id: '2', title: 'System Security Principles', issued: '2023-04-12' },
];

const PORTFOLIO = [
  { title: 'Neural Net Visualizer', tags: ['React', 'Node.js', 'Python'] },
  { title: 'Encrypted Chat CLI', tags: ['Rust', 'OpenSSL'] },
];

const PRIVACY = [
  { label: 'Public Portfolio', on: true },
  { label: 'Show Rank & XP', on: false },
];
