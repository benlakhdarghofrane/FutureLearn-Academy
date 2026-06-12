import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CourseCard } from '@/components/course/CourseCard';
import { CheckCircle, Play, Users, Star, Award, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-hero-glow" />
        {/* Animated orb */}
        <div className="absolute right-[5%] top-[10%] w-[500px] h-[500px] opacity-60 pointer-events-none">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full border border-primary/30 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-8 rounded-full border border-accent-blue/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <div className="absolute inset-16 rounded-full border border-primary/20 animate-spin" style={{ animationDuration: '25s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-primary/10 blur-xl animate-glow-pulse" />
            </div>
            {/* Code snippet */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-xs text-primary/70 whitespace-nowrap">
              <div className="text-accent-blue">const</div>
              <div><span className="text-accent-blue">const</span> <span className="text-white">futuR</span> = <span className="text-accent-cyan">nRw</span> <span className="text-primary">DAvRlopAR</span>();</div>
              <div><span className="text-white">futuR</span>.<span className="text-accent-green">lAarn</span>();</div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Now enrolling — Spring Cohort 2024
            </div>
            <h1 className="text-6xl font-bold leading-tight mb-6">
              Build Real<br />
              <span className="text-primary">Digital Skills</span><br />
              for the Future
            </h1>
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
              Learn programming, design, entrepreneurship, and creativity through live online training,
              expert mentors, real projects, and career-focused learning.
            </p>
            <div className="flex items-center gap-4 mb-8">
              <Link href="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-3">
                Explore Programs <ArrowRight size={18} />
              </Link>
              <button className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                  <Play size={14} fill="currentColor" />
                </div>
                Watch Overview
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              {['Live Online Classes', 'Expert Teachers', 'Scholarships', 'Certificates'].map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-primary" /> {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '5000+', label: 'Students Enrolled' },
            { value: '120+', label: 'Expert Mentors' },
            { value: '50+', label: 'Live Programs' },
            { value: '20+', label: 'Career Tracks' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-text-muted text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-primary text-sm font-medium mb-2">CURRICULUM</div>
            <h2 className="text-3xl font-bold">Featured Programs</h2>
          </div>
          <Link href="/courses" className="btn-outline text-sm">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Why FutureLearn */}
      <section className="bg-surface border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-primary text-sm font-medium mb-2">THE ECOSYSTEM</div>
            <h2 className="text-4xl font-bold mb-4">Build the Future,<br /><span className="text-primary">Not Just Learn It.</span></h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              We go beyond tutorials. Real projects, real mentors, real career outcomes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card hover:border-primary/40 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-text-muted text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Engineer Your Future?</h2>
        <p className="text-text-secondary mb-8 max-w-lg mx-auto">
          Join thousands of developers building the skills that matter.
        </p>
        <Link href="/register" className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4">
          Start Learning Free <ArrowRight size={18} />
        </Link>
      </section>

      <Footer />
    </div>
  );
}

const FEATURED_COURSES = [
  {
    id: '1',
    title: 'Full-Stack Web Development Mastery',
    description: 'Engineer robust, scalable applications from database to DOM. Master React, Node.js and modern DevOps.',
    level: 'Advanced',
    durationWeeks: 12,
    tags: ['React', 'Node.js', 'PostgreSQL'],
    thumbnail: null,
    instructor: { fullName: 'Alex Mercer', avatar: null },
    enrollments: [{ id: '1' }, { id: '2' }, { id: '3' }],
  },
  {
    id: '2',
    title: 'Advanced React Patterns & Next.js 14',
    description: 'Mastering Server Components, streaming, and optimistic UI updates for enterprise-scale apps.',
    level: 'Advanced',
    durationWeeks: 8,
    tags: ['React', 'Next.js', 'TypeScript'],
    thumbnail: null,
    instructor: { fullName: 'Sarah Chen', avatar: null },
    enrollments: [{ id: '1' }, { id: '2' }],
  },
  {
    id: '3',
    title: 'System Architecture & Backend Engineering',
    description: 'Design scalable distributed systems. Learn microservices, Kafka, Redis, and cloud deployment.',
    level: 'Advanced',
    durationWeeks: 10,
    tags: ['NestJS', 'Docker', 'AWS'],
    thumbnail: null,
    instructor: { fullName: 'Marcus Lee', avatar: null },
    enrollments: [{ id: '1' }],
  },
];

const FEATURES = [
  {
    title: 'Project Showcase',
    desc: 'Build and ship real products. Get reviewed by senior engineers.',
    icon: <Star size={20} />,
  },
  {
    title: 'AI & Automation Lab',
    desc: 'Hands-on AI tools, automations, and cutting-edge frameworks.',
    icon: <Award size={20} />,
  },
  {
    title: 'Startup Incubator',
    desc: 'Turn your ideas into funded startups with mentor guidance.',
    icon: <Users size={20} />,
  },
  {
    title: 'Technical Mastery',
    desc: 'Blockchain-verified certificates proving your engineering excellence.',
    icon: <CheckCircle size={20} />,
  },
];
