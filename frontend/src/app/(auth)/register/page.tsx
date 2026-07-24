'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { BookOpen, User, GraduationCap, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const schema = z.object({
  fullName: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
  role: z.enum(['student', 'instructor']),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'student' },
  });

  const role = watch('role');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.register(data);
      login(res.data.access_token, res.data.user);
      toast.success('Welcome to FutureLearn Academy!');
      router.push(data.role === 'instructor' ? '/dashboard/instructor' : '/dashboard/student');
    } catch (err: any) {
      if (!err.response) {
        toast.error('The API server is not reachable. Please start the backend on port 3001 and try again.');
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex flex-col w-[420px] bg-surface border-r border-border p-10">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-auto">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen size={16} />
          </div>
          <span>FutureLearn.</span>
        </Link>
        <div className="mb-auto">
          <h2 className="text-3xl font-bold mb-3">
            Engineer<br />Your Future.
          </h2>
          <p className="text-text-muted text-sm leading-relaxed mb-8">
            Join the premium coding academy for high-ambition developers.
            Access elite curriculum, mentor networks, and advanced tools.
          </p>
          {/* Code snippet */}
          <div className="bg-background rounded-xl border border-border p-4 font-mono text-xs">
            <div className="flex gap-1.5 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="text-text-muted space-y-0.5">
              <div><span className="text-accent-blue">const</span> academy = <span className="text-accent-cyan">new</span> <span className="text-primary">FutureLearn</span>();</div>
              <div />
              <div>academy.<span className="text-accent-green">enroll</span>{'({'}</div>
              <div className="pl-4">user: <span className="text-yellow-400">"current"</span>,</div>
              <div className="pl-4">status: <span className="text-yellow-400">"ready"</span>,</div>
              <div className="pl-4">potential: <span className="text-primary">Infinity</span></div>
              <div>{'});'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <h1 className="text-2xl font-bold mb-1">Create Account</h1>
          <p className="text-text-muted text-sm mb-8">Initialize your profile to begin the journey.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['student', 'instructor'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setValue('role', r)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                      role === r
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-text-secondary hover:border-primary/50'
                    }`}
                  >
                    {r === 'student' ? <User size={16} /> : <GraduationCap size={16} />}
                    <span className="text-sm font-medium capitalize">{r}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  {...register('fullName')}
                  className="input pl-10"
                  placeholder="e.g. Ada Lovelace"
                />
              </div>
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-xs">@</span>
                <input
                  {...register('email')}
                  className="input pl-8"
                  placeholder="ada@futurelearn.io"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? 'Creating account...' : <>Initialize Profile <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-6">
            Already have access?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Login via SSH
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
