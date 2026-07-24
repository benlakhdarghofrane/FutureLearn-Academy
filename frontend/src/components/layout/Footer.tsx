import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen size={14} />
              </div>
              FutureLearn Academy
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              © {new Date().getFullYear()} FutureLearn Academy — Alger, Algérie.<br />
              La plateforme algérienne de formation aux métiers du numérique.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-white mb-3">Plateforme</div>
            <ul className="space-y-2">
              <li><Link href="/courses" className="text-sm text-text-muted hover:text-white transition-colors">Formations</Link></li>
              <li><Link href="/register" className="text-sm text-text-muted hover:text-white transition-colors">Devenir formateur</Link></li>
              <li><Link href="/login" className="text-sm text-text-muted hover:text-white transition-colors">Se connecter</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-white mb-3">Compte</div>
            <ul className="space-y-2">
              <li><Link href="/register" className="text-sm text-text-muted hover:text-white transition-colors">Créer un compte</Link></li>
              <li><Link href="/profile" className="text-sm text-text-muted hover:text-white transition-colors">Mon profil</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
