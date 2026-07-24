'use client';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { settingsApi } from '@/lib/api';
import { toast } from 'sonner';
import { Save, Plus, Trash2 } from 'lucide-react';

interface Feature { title: string; description: string }
interface Testimonial { name: string; role: string; text: string }

export default function AdminSettingsPage() {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => settingsApi.get().then((r) => r.data),
  });

  const [form, setForm] = useState<any>({});
  const [features, setFeatures] = useState<Feature[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (settings) {
      setForm({
        heroBadge: settings.heroBadge ?? '',
        heroTitle: settings.heroTitle ?? '',
        heroTitleHighlight: settings.heroTitleHighlight ?? '',
        heroDescription: settings.heroDescription ?? '',
        ctaTitle: settings.ctaTitle ?? '',
        ctaDescription: settings.ctaDescription ?? '',
        contactEmail: settings.contactEmail ?? '',
        contactPhone: settings.contactPhone ?? '',
        city: settings.city ?? '',
      });
      setFeatures(settings.features ?? []);
      setTestimonials(settings.testimonials ?? []);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: () => settingsApi.update({ ...form, features, testimonials }),
    onSuccess: () => {
      toast.success('Contenu du site mis à jour');
      qc.invalidateQueries({ queryKey: ['site-settings'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Échec de la mise à jour'),
  });

  const set = (key: string, value: string) => setForm((f: any) => ({ ...f, [key]: value }));

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="admin" />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Contenu du site</h1>
            <p className="text-text-muted text-sm">Gérez ce qui s'affiche sur la page d'accueil. Les statistiques (étudiants, formations...) sont calculées automatiquement et non modifiables ici.</p>
          </div>
          <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="btn-primary flex items-center gap-2 text-sm">
            <Save size={14} /> Enregistrer
          </button>
        </div>

        {isLoading ? (
          <div className="p-8"><div className="card h-64 animate-pulse" /></div>
        ) : (
          <div className="p-8 max-w-3xl space-y-6">
            <div className="card space-y-4">
              <h3 className="font-semibold text-sm text-text-muted uppercase tracking-wider">Section principale (Hero)</h3>
              <Field label="Badge (petit texte en haut)" value={form.heroBadge} onChange={(v) => set('heroBadge', v)} />
              <Field label="Titre principal" value={form.heroTitle} onChange={(v) => set('heroTitle', v)} />
              <Field label="Titre — mot mis en avant" value={form.heroTitleHighlight} onChange={(v) => set('heroTitleHighlight', v)} />
              <Field label="Description" textarea value={form.heroDescription} onChange={(v) => set('heroDescription', v)} />
            </div>

            <div className="card space-y-4">
              <h3 className="font-semibold text-sm text-text-muted uppercase tracking-wider">Appel à l'action (bas de page)</h3>
              <Field label="Titre" value={form.ctaTitle} onChange={(v) => set('ctaTitle', v)} />
              <Field label="Description" textarea value={form.ctaDescription} onChange={(v) => set('ctaDescription', v)} />
            </div>

            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-text-muted uppercase tracking-wider">Pourquoi nous choisir (cartes)</h3>
                <button
                  type="button"
                  onClick={() => setFeatures([...features, { title: '', description: '' }])}
                  className="btn-outline text-xs flex items-center gap-1 px-3 py-1.5"
                >
                  <Plus size={12} /> Ajouter
                </button>
              </div>
              {features.length === 0 && <p className="text-sm text-text-muted">Aucune carte. Elles n'apparaîtront pas sur la page tant que vous n'en ajoutez pas.</p>}
              {features.map((f, i) => (
                <div key={i} className="flex gap-2 items-start p-3 rounded-lg bg-surface border border-border">
                  <div className="flex-1 space-y-2">
                    <input
                      value={f.title}
                      onChange={(e) => setFeatures(features.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                      className="input text-sm"
                      placeholder="Titre"
                    />
                    <input
                      value={f.description}
                      onChange={(e) => setFeatures(features.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))}
                      className="input text-sm"
                      placeholder="Description"
                    />
                  </div>
                  <button onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-text-secondary hover:text-red-400 flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-text-muted uppercase tracking-wider">Témoignages</h3>
                <button
                  type="button"
                  onClick={() => setTestimonials([...testimonials, { name: '', role: '', text: '' }])}
                  className="btn-outline text-xs flex items-center gap-1 px-3 py-1.5"
                >
                  <Plus size={12} /> Ajouter
                </button>
              </div>
              <p className="text-xs text-text-muted">N'ajoutez que de vrais témoignages d'étudiants. Ils n'apparaîtront pas sur la page tant que la liste est vide.</p>
              {testimonials.map((t, i) => (
                <div key={i} className="flex gap-2 items-start p-3 rounded-lg bg-surface border border-border">
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={t.name}
                        onChange={(e) => setTestimonials(testimonials.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                        className="input text-sm"
                        placeholder="Nom de l'étudiant"
                      />
                      <input
                        value={t.role}
                        onChange={(e) => setTestimonials(testimonials.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))}
                        className="input text-sm"
                        placeholder="Formation suivie"
                      />
                    </div>
                    <textarea
                      value={t.text}
                      onChange={(e) => setTestimonials(testimonials.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
                      rows={2}
                      className="input text-sm resize-none"
                      placeholder="Témoignage"
                    />
                  </div>
                  <button onClick={() => setTestimonials(testimonials.filter((_, j) => j !== i))} className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-text-secondary hover:text-red-400 flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div className="card space-y-4">
              <h3 className="font-semibold text-sm text-text-muted uppercase tracking-wider">Contact</h3>
              <Field label="E-mail" value={form.contactEmail} onChange={(v) => set('contactEmail', v)} />
              <Field label="Téléphone" value={form.contactPhone} onChange={(v) => set('contactPhone', v)} />
              <Field label="Ville" value={form.city} onChange={(v) => set('city', v)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">{label}</label>
      {textarea ? (
        <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={3} className="input resize-none text-sm" />
      ) : (
        <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="input text-sm" />
      )}
    </div>
  );
}
