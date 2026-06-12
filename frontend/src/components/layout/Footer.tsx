import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen size={14} />
              </div>
              FutureLearn Academy
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              © 2024 FutureLearn Academy.<br />
              Engineering excellence through precision code.
            </p>
          </div>
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <div className="text-sm font-semibold text-white mb-3">{col.title}</div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-text-muted hover:text-white transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

const FOOTER_LINKS = [
  {
    title: 'Programs',
    links: ['AI Curriculum', 'Fullstack Track', 'Data Science', 'Web3 Dev'],
  },
  {
    title: 'Platform',
    links: ['Curriculum', 'Enterprise', 'Scholarships'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service'],
  },
  {
    title: 'Developers',
    links: ['API Docs'],
  },
];
