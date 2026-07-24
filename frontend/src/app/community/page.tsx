'use client';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MessageCircle, Heart, Share2, ChevronRight, MessageSquare } from 'lucide-react';

export default function CommunityPage() {
  const topics = [
    {
      id: '1',
      title: 'React & Frontend Architecture',
      description: 'Discussions about React patterns, Server Components, and modern frontend practices.',
      replies: 234,
      followers: 1203,
      recent: 'Now',
    },
    {
      id: '2',
      title: 'Backend & System Design',
      description: 'Deep dives into NestJS, microservices, database design, and scalability.',
      replies: 189,
      followers: 956,
      recent: '2h ago',
    },
    {
      id: '3',
      title: 'Career & Interview Prep',
      description: 'Share experiences, ask for advice, and help others prepare for tech roles.',
      replies: 412,
      followers: 1834,
      recent: '15m ago',
    },
    {
      id: '4',
      title: 'AI & Machine Learning',
      description: 'Explore AI/ML projects, discuss algorithms, and learn from the community.',
      replies: 156,
      followers: 843,
      recent: '1h ago',
    },
    {
      id: '5',
      title: 'DevOps & Cloud',
      description: 'Docker, Kubernetes, AWS, and everything infrastructure-related.',
      replies: 98,
      followers: 567,
      recent: '4h ago',
    },
    {
      id: '6',
      title: 'Project Showcase',
      description: 'Share your projects and get feedback from the community.',
      replies: 267,
      followers: 1521,
      recent: 'Now',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Community</h1>
            <p className="text-text-secondary text-lg max-w-2xl">
              Connect with fellow developers, share knowledge, and grow together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/community/${topic.id}`}
                className="group card hover:border-primary/40 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{topic.title}</h3>
                    <p className="text-text-muted text-sm line-clamp-2 mb-3">{topic.description}</p>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span>{topic.replies} replies</span>
                      <span>{topic.followers} following</span>
                      <span className="text-primary">Active {topic.recent}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Start a New Discussion</h2>
            <p className="text-text-muted mb-6 max-w-lg mx-auto">
              Have a question or idea to share? Start a new thread in the community.
            </p>
            <button className="btn-primary">New Discussion</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
