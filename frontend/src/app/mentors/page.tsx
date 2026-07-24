'use client';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Star, MessageCircle, Heart, ChevronRight } from 'lucide-react';

export default function MentorsPage() {
  const mentors = [
    {
      id: '1',
      name: 'Alex Mercer',
      title: 'Full-Stack Architect',
      bio: 'Ex-Google engineer. Specializes in building scalable web applications and system design.',
      expertise: ['React', 'Node.js', 'PostgreSQL', 'System Design'],
      rating: 4.9,
      reviews: 234,
      sessions: 156,
      hourlyRate: 75,
      avatar: '🧑‍💼',
    },
    {
      id: '2',
      name: 'Sarah Chen',
      title: 'Frontend Expert',
      bio: 'Lead Frontend Engineer at Vercel. Expert in Next.js and modern React patterns.',
      expertise: ['React', 'Next.js', 'TypeScript', 'Performance'],
      rating: 4.95,
      reviews: 189,
      sessions: 143,
      hourlyRate: 80,
      avatar: '👩‍💻',
    },
    {
      id: '3',
      name: 'Marcus Lee',
      title: 'Backend & DevOps',
      bio: 'Cloud architect with 10+ years experience. AWS and Kubernetes specialist.',
      expertise: ['NestJS', 'Docker', 'Kubernetes', 'AWS'],
      rating: 4.87,
      reviews: 167,
      sessions: 198,
      hourlyRate: 85,
      avatar: '👨‍🔧',
    },
    {
      id: '4',
      name: 'Emma Watson',
      title: 'AI/ML Engineer',
      bio: 'PhD in Computer Science. Building cutting-edge AI applications.',
      expertise: ['Python', 'TensorFlow', 'Machine Learning', 'Data Science'],
      rating: 4.92,
      reviews: 145,
      sessions: 127,
      hourlyRate: 90,
      avatar: '👩‍🎓',
    },
    {
      id: '5',
      name: 'James Wilson',
      title: 'Startup Mentor',
      bio: 'Founded 2 successful startups. Helps engineers transition to founding roles.',
      expertise: ['Entrepreneurship', 'Fundraising', 'Product', 'Strategy'],
      rating: 4.88,
      reviews: 98,
      sessions: 87,
      hourlyRate: 100,
      avatar: '🚀',
    },
    {
      id: '6',
      name: 'Lisa Rodriguez',
      title: 'Career Coach',
      bio: 'Helps developers land jobs at top tech companies.',
      expertise: ['Interviewing', 'Resume', 'Networking', 'Negotiation'],
      rating: 4.93,
      reviews: 212,
      sessions: 251,
      hourlyRate: 65,
      avatar: '💼',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Expert Mentors</h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Learn from industry leaders. 1-on-1 mentorship sessions to accelerate your growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Link
                key={mentor.id}
                href={`/mentors/${mentor.id}`}
                className="group card hover:border-primary/40 transition-all cursor-pointer flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-2xl flex-shrink-0">
                    {mentor.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg">{mentor.name}</h3>
                    <p className="text-primary text-sm">{mentor.title}</p>
                  </div>
                </div>

                <p className="text-text-muted text-sm mb-4 flex-1 line-clamp-2">{mentor.bio}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {mentor.expertise.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-text-muted mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{mentor.rating}</span>
                    <span className="text-text-muted">({mentor.reviews})</span>
                  </div>
                  <span>{mentor.sessions} sessions</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">${mentor.hourlyRate}/hr</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="btn-primary text-sm py-2"
                  >
                    Book Now
                  </button>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 bg-card border border-border rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Become a Mentor</h2>
            <p className="text-text-muted mb-6 max-w-lg mx-auto">
              Earn while helping others. Share your expertise with the community.
            </p>
            <button className="btn-primary">Apply as Mentor</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
