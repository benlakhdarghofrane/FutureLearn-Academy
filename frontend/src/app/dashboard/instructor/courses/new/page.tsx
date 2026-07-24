'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { coursesApi } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
  title: z.string().min(5, 'Min 5 characters'),
  description: z.string().min(20, 'Min 20 characters'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number().min(0),
  durationWeeks: z.number().min(1),
  previewVideoUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewCoursePage() {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { level: 'intermediate', price: 0, durationWeeks: 8 },
  });

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await coursesApi.create({ ...data, tags });
      toast.success('Course created! Add your lessons below.');
      router.push(`/dashboard/instructor/courses/${res.data.id}/edit`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="instructor" />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border px-8 py-5 flex items-center gap-4">
          <Link href="/dashboard/instructor/courses" className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-text-secondary hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Create New Course</h1>
            <p className="text-text-muted text-sm">Fill in the details to publish your course</p>
          </div>
        </div>

        <div className="p-8 max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="card space-y-5">
              <h3 className="font-semibold text-sm text-text-muted uppercase tracking-wider">Basic Info</h3>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">Course Title</label>
                <input {...register('title')} className="input" placeholder="e.g. Full-Stack Web Development Mastery" />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">Description</label>
                <textarea {...register('description')} rows={4} className="input resize-none" placeholder="Describe what students will learn..." />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">Level</label>
                  <select {...register('level')} className="input">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">Prix (DA)</label>
                  <input {...register('price', { valueAsNumber: true })} type="number" className="input" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">Duration (weeks)</label>
                  <input {...register('durationWeeks', { valueAsNumber: true })} type="number" className="input" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">Preview Video URL</label>
                <input {...register('previewVideoUrl')} className="input" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">Tags</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {tags.map((t) => (
                    <span key={t} className="flex items-center gap-1.5 tag text-white">
                      {t}
                      <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="input flex-1"
                    placeholder="Add a tag..."
                  />
                  <button type="button" onClick={addTag} className="btn-outline flex items-center gap-1 text-sm px-4">
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
