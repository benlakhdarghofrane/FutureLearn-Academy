import Link from 'next/link';
import { Clock, Users, ChevronRight } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  durationWeeks: number;
  tags: string[];
  thumbnail?: string | null;
  instructor: { fullName: string; avatar?: string | null };
  enrollments?: any[];
}

export function CourseCard({ course }: { course: Course }) {
  const levelColor: Record<string, string> = {
    beginner: 'badge-green',
    intermediate: 'badge-blue',
    advanced: 'badge-purple',
  };

  return (
    <Link href={`/courses/${course.id}`}>
      <div className="card hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 group cursor-pointer h-full flex flex-col">
        {/* Thumbnail */}
        <div className="h-40 rounded-lg bg-gradient-to-br from-primary/20 via-surface to-accent-blue/10 mb-4 flex items-center justify-center overflow-hidden relative">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="font-mono text-xs text-primary/40 text-center px-4">
              <div className="text-primary/60 mb-1">{'// ' + course.tags?.[0]}</div>
              <div className="text-white/30">{course.title.substring(0, 20)}...</div>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className={levelColor[course.level?.toLowerCase()] || 'badge-purple'}>
              {course.level}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-white mb-2 group-hover:text-primary transition-colors leading-tight">
            {course.title}
          </h3>
          <p className="text-text-muted text-sm mb-4 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Tags */}
        {course.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {course.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {course.durationWeeks}w
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} /> {course.enrollments?.length || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
              {course.instructor?.fullName?.charAt(0)}
            </div>
            <span className="text-xs text-text-secondary">{course.instructor?.fullName?.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
