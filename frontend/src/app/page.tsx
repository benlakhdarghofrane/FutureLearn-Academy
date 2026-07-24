import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CourseCard } from '@/components/course/CourseCard';
import { CheckCircle, Play, ArrowRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getSettings() {
  try {
    const res = await fetch(`${API_URL}/settings`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getFeaturedCourses() {
  try {
    const res = await fetch(`${API_URL}/courses`, { cache: 'no-store' });
    if (!res.ok) return [];
    const courses = await res.json();
    return Array.isArray(courses) ? courses.slice(0, 3) : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [settings, courses] = await Promise.all([getSettings(), getFeaturedCourses()]);

  const heroBadge = settings?.heroBadge || 'Inscriptions ouvertes';
  const heroTitle = settings?.heroTitle || 'Développez de vraies compétences numériques';
  const heroTitleHighlight = settings?.heroTitleHighlight || 'pour votre avenir';
  const heroDescription =
    settings?.heroDescription ||
    "Apprenez la programmation, le design et l'entrepreneuriat grâce à des formations en ligne, en Algérie.";
  const ctaTitle = settings?.ctaTitle || 'Prêt à construire votre avenir ?';
  const ctaDescription =
    settings?.ctaDescription || 'Rejoignez les apprenants qui développent dès aujourd’hui les compétences qui comptent.';
  const features = Array.isArray(settings?.features) && settings.features.length > 0 ? settings.features : [];
  const testimonials = Array.isArray(settings?.testimonials) ? settings.testimonials : [];
  const stats = settings?.stats || { totalStudents: 0, totalInstructors: 0, totalCourses: 0, totalEnrollments: 0 };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute right-[5%] top-[10%] w-[500px] h-[500px] opacity-60 pointer-events-none">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full border border-primary/30 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-8 rounded-full border border-accent-blue/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <div className="absolute inset-16 rounded-full border border-primary/20 animate-spin" style={{ animationDuration: '25s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-primary/10 blur-xl animate-glow-pulse" />
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {heroBadge}
            </div>
            <h1 className="text-6xl font-bold leading-tight mb-6">
              {heroTitle}
              {heroTitleHighlight && (
                <>
                  {' '}
                  <span className="text-primary">{heroTitleHighlight}</span>
                </>
              )}
            </h1>
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">{heroDescription}</p>
            <div className="flex items-center gap-4 mb-8">
              <Link href="/courses" className="btn-primary flex items-center gap-2 text-base px-8 py-3">
                Voir les formations <ArrowRight size={18} />
              </Link>
              <Link href="/register" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                  <Play size={14} fill="currentColor" />
                </div>
                Créer un compte
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              {['Paiement en dinars (DZD)', 'Formateurs experts', 'Certificats'].map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-primary" /> {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats — live counts from the database, never hardcoded */}
      <section className="border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: stats.totalStudents, label: 'Étudiants inscrits' },
            { value: stats.totalInstructors, label: 'Formateurs' },
            { value: stats.totalCourses, label: 'Formations publiées' },
            { value: stats.totalEnrollments, label: 'Inscriptions aux cours' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-text-muted text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses — real published courses from the database */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-primary text-sm font-medium mb-2">FORMATIONS</div>
            <h2 className="text-3xl font-bold">Formations à la une</h2>
          </div>
          <Link href="/courses" className="btn-outline text-sm">Voir tout</Link>
        </div>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-16 text-text-muted">
            Aucune formation publiée pour le moment. Revenez bientôt !
          </div>
        )}
      </section>

      {/* Why FutureLearn — content managed from the admin panel */}
      {features.length > 0 && (
        <section className="bg-surface border-y border-border py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="text-primary text-sm font-medium mb-2">POURQUOI FUTURELEARN</div>
              <h2 className="text-4xl font-bold mb-4">
                Apprenez en construisant,<br /><span className="text-primary">pas seulement en regardant.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f: any) => (
                <div key={f.title} className="card hover:border-primary/40 transition-colors">
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-text-muted text-sm">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials — only real student testimonials added by the admin */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <div className="text-primary text-sm font-medium mb-2">TÉMOIGNAGES</div>
            <h2 className="text-3xl font-bold">Ce que disent nos étudiants</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t: any, i: number) => (
              <div key={i} className="card">
                <p className="text-text-secondary text-sm leading-relaxed mb-4">« {t.text} »</p>
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-xs text-text-muted">{t.role}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">{ctaTitle}</h2>
        <p className="text-text-secondary mb-8 max-w-lg mx-auto">{ctaDescription}</p>
        <Link href="/register" className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4">
          Commencer gratuitement <ArrowRight size={18} />
        </Link>
      </section>

      <Footer />
    </div>
  );
}
