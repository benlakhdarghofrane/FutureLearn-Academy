'use client';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Bookmark, Heart, Share2, ChevronRight } from 'lucide-react';

export default function PathsPage() {
  const paths = [
    {
      id: '1',
      title: 'Full-Stack Web Developer',
      description: 'Master everything from database design to responsive UI. Build enterprise-grade web applications.',
      progress: 65,
      courses: 8,
      duration: '16 weeks',
      difficulty: 'Advanced',
      color: 'from-primary to-primary-dark',
    },
    {
      id: '2',
      title: 'AI & Machine Learning Specialist',
      description: 'Learn the fundamentals and advanced techniques in AI, deep learning, and neural networks.',
      progress: 0,
      courses: 6,
      duration: '12 weeks',
      difficulty: 'Advanced',
      color: 'from-accent-blue to-accent-cyan',
    },
    {
      id: '3',
      title: 'Cloud & DevOps Engineer',
      description: 'Master cloud deployment, containerization, orchestration, and infrastructure as code.',
      progress: 0,
      courses: 5,
      duration: '10 weeks',
      difficulty: 'Intermediate',
      color: 'from-accent-green to-accent-cyan',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Learning Paths</h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Structured learning paths designed to take you from fundamentals to industry-ready expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((path) => (
              <Link
                key={path.id}
                href={`/paths/${path.id}`}
                className="group card hover:border-primary/40 transition-all overflow-hidden cursor-pointer"
              >
                <div className={`h-24 bg-gradient-to-r ${path.color} opacity-80 group-hover:opacity-100 transition-opacity relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-50" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }} />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg flex-1">{path.title}</h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="w-8 h-8 rounded-lg bg-card hover:bg-surface flex items-center justify-center text-text-muted hover:text-white transition-colors flex-shrink-0"
                    >
                      <Bookmark size={16} />
                    </button>
                  </div>
                  <p className="text-text-muted text-sm mb-4 line-clamp-2">{path.description}</p>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-text-muted">Progress</span>
                        <span className="text-xs font-medium text-primary">{path.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent-blue rounded-full"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-text-muted mb-4 pb-4 border-b border-border">
                    <span>{path.courses} courses</span>
                    <span>{path.duration}</span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{path.difficulty}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-primary group-hover:translate-x-1 transition-transform">
                    View Path
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 bg-card border border-border rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Create Your Custom Path</h2>
            <p className="text-text-muted mb-6 max-w-lg mx-auto">
              Mix and match courses to create a learning path tailored to your goals.
            </p>
            <button className="btn-primary">Start Building</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
