'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CourseCard } from '@/components/course/CourseCard';
import { coursesApi } from '@/lib/api';
import { Search, SlidersHorizontal } from 'lucide-react';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const TAGS = ['All', 'React', 'Node.js', 'Python', 'TypeScript', 'NestJS', 'PostgreSQL', 'Docker', 'AWS'];

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [tag, setTag] = useState('All');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', search, level, tag],
    queryFn: () =>
      coursesApi.getAll({
        search: search || undefined,
        level: level !== 'All' ? level.toLowerCase() : undefined,
        tag: tag !== 'All' ? tag : undefined,
      }).then((r) => r.data),
  });

  const displayCourses = courses ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="border-b border-border bg-surface py-14 text-center">
          <div className="text-primary text-sm font-medium mb-2">CURRICULUM</div>
          <h1 className="text-4xl font-bold mb-3">All Programs</h1>
          <p className="text-text-muted max-w-md mx-auto text-sm">
            Hands-on courses built for engineers who want to go from good to exceptional.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
                placeholder="Search courses..."
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    level === l
                      ? 'bg-primary text-white'
                      : 'bg-card border border-border text-text-secondary hover:border-primary/50'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap mb-8">
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`tag transition-all hover:border-primary/50 ${tag === t ? 'border-primary text-primary' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card h-64 animate-pulse">
                  <div className="h-32 bg-surface rounded-lg mb-4" />
                  <div className="h-4 bg-surface rounded w-3/4 mb-2" />
                  <div className="h-3 bg-surface rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : displayCourses.length === 0 ? (
            <div className="card text-center py-16 text-text-muted">
              Aucune formation ne correspond à votre recherche pour le moment.
            </div>
          ) : (
            <>
              <div className="text-text-muted text-sm mb-4">{displayCourses.length} courses found</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayCourses.map((course: any) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
