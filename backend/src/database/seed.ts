/**
 * Seed script — populates the database with real, editable launch content.
 * Everything created here is a normal row in the database: the admin can
 * edit or delete any of it afterwards from the Admin panel. Nothing in the
 * frontend is hardcoded — this script is the *only* source of initial data.
 *
 * Usage: npm run seed   (from the backend/ directory)
 */
import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import dataSource from './data-source';
import { User, UserRole } from '../users/entities/user.entity';
import { Course, CourseLevel } from '../courses/entities/course.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { SiteSetting } from '../settings/entities/site-setting.entity';

async function seed() {
  await dataSource.initialize();
  console.log('Connected to database.');

  const userRepo = dataSource.getRepository(User);
  const courseRepo = dataSource.getRepository(Course);
  const lessonRepo = dataSource.getRepository(Lesson);
  const settingsRepo = dataSource.getRepository(SiteSetting);

  const hash = (pwd: string) => bcrypt.hash(pwd, 10);

  // --- Admin account ---
  let admin = await userRepo.findOne({ where: { email: 'admin@futurelearn.dz' } });
  if (!admin) {
    admin = await userRepo.save(
      userRepo.create({
        fullName: 'Administrateur FutureLearn',
        email: 'admin@futurelearn.dz',
        password: await hash('Admin@2026'),
        role: UserRole.ADMIN,
        title: 'Administrateur de la plateforme',
        rank: 'Platine',
      }),
    );
    console.log('Created admin: admin@futurelearn.dz / Admin@2026 (change this password after first login)');
  }

  // --- Instructor accounts ---
  const instructorsData = [
    {
      fullName: 'Amine Belkacemi',
      email: 'amine.belkacemi@futurelearn.dz',
      title: 'Ingénieur Full-Stack',
      bio: "Développeur full-stack depuis plus de 8 ans, spécialisé en Next.js, NestJS et architecture cloud. Formateur passionné par la transmission de compétences concrètes.",
      techStack: ['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL'],
    },
    {
      fullName: 'Yasmine Cherif',
      email: 'yasmine.cherif@futurelearn.dz',
      title: 'Designer UX/UI',
      bio: "Designer produit avec une expérience en startups algériennes et internationales. Enseigne le design d'interface centré utilisateur.",
      techStack: ['Figma', 'Design Systems', 'UX Research'],
    },
  ];

  const instructors: User[] = [];
  for (const data of instructorsData) {
    let instructor = await userRepo.findOne({ where: { email: data.email } });
    if (!instructor) {
      instructor = await userRepo.save(
        userRepo.create({
          ...data,
          password: await hash('Formateur@2026'),
          role: UserRole.INSTRUCTOR,
          rank: 'Or',
        }),
      );
      console.log(`Created instructor: ${data.email} / Formateur@2026`);
    }
    instructors.push(instructor);
  }

  // --- Courses (prices in Algerian Dinar) ---
  const coursesData = [
    {
      title: 'Développement Web Full-Stack avec Next.js & NestJS',
      description:
        "Apprenez à construire des applications web modernes de bout en bout : frontend en Next.js (App Router), backend en NestJS, base de données PostgreSQL. Vous terminerez ce parcours avec un projet complet déployé.",
      level: CourseLevel.INTERMEDIATE,
      tags: ['Next.js', 'NestJS', 'PostgreSQL', 'TypeScript'],
      price: 24000,
      durationWeeks: 10,
      isPublished: true,
      instructor: instructors[0],
      lessons: [
        { title: 'Introduction et mise en place de l’environnement', duration: 1200, isFree: true },
        { title: 'Les fondamentaux de Next.js (App Router)', duration: 2400, isFree: true },
        { title: 'Construire une API REST avec NestJS', duration: 3000, isFree: false },
        { title: 'Modélisation des données avec TypeORM et PostgreSQL', duration: 2700, isFree: false },
        { title: 'Authentification JWT et gestion des rôles', duration: 2400, isFree: false },
        { title: 'Déploiement en production', duration: 1800, isFree: false },
      ],
    },
    {
      title: 'Les Fondamentaux du Design UX/UI',
      description:
        "Un parcours pratique pour apprendre à concevoir des interfaces claires et efficaces : recherche utilisateur, wireframing, prototypage sur Figma, et création d'un design system.",
      level: CourseLevel.BEGINNER,
      tags: ['Figma', 'UX', 'UI', 'Design System'],
      price: 15000,
      durationWeeks: 6,
      isPublished: true,
      instructor: instructors[1],
      lessons: [
        { title: 'Principes fondamentaux du design d’interface', duration: 1500, isFree: true },
        { title: 'Recherche utilisateur et personas', duration: 1800, isFree: true },
        { title: 'Wireframing et architecture de l’information', duration: 2100, isFree: false },
        { title: 'Prototypage interactif avec Figma', duration: 2400, isFree: false },
        { title: 'Construire un design system cohérent', duration: 2100, isFree: false },
      ],
    },
    {
      title: 'JavaScript Moderne : des Bases à la Maîtrise',
      description:
        "Maîtrisez JavaScript ES6+ à travers des exercices pratiques : closures, promesses, async/await, modules, et les bonnes pratiques utilisées en entreprise.",
      level: CourseLevel.BEGINNER,
      tags: ['JavaScript', 'ES6+', 'Programmation'],
      price: 9500,
      durationWeeks: 5,
      isPublished: true,
      instructor: instructors[0],
      lessons: [
        { title: 'Variables, types et opérateurs', duration: 1200, isFree: true },
        { title: 'Fonctions et closures', duration: 1500, isFree: true },
        { title: 'Programmation asynchrone : promesses et async/await', duration: 2100, isFree: false },
        { title: 'Modules et outils modernes (npm, bundlers)', duration: 1800, isFree: false },
      ],
    },
    {
      title: 'Introduction à l’Entrepreneuriat Numérique',
      description:
        "Un cours conçu pour les développeurs et designers algériens souhaitant lancer leur propre produit numérique : validation d’idée, MVP, pricing local, et premiers clients.",
      level: CourseLevel.BEGINNER,
      tags: ['Entrepreneuriat', 'Produit', 'Startup'],
      price: 12000,
      durationWeeks: 4,
      isPublished: false,
      instructor: instructors[1],
      lessons: [
        { title: 'Valider une idée avant de coder', duration: 1500, isFree: true },
        { title: 'Construire un MVP en 4 semaines', duration: 2100, isFree: false },
      ],
    },
  ];

  for (const c of coursesData) {
    let course = await courseRepo.findOne({ where: { title: c.title } });
    if (!course) {
      course = await courseRepo.save(
        courseRepo.create({
          title: c.title,
          description: c.description,
          level: c.level,
          tags: c.tags,
          price: c.price,
          durationWeeks: c.durationWeeks,
          isPublished: c.isPublished,
          instructorId: c.instructor.id,
        }),
      );
      let order = 0;
      for (const l of c.lessons) {
        await lessonRepo.save(
          lessonRepo.create({
            title: l.title,
            duration: l.duration,
            isFree: l.isFree,
            order: order++,
            courseId: course.id,
          }),
        );
      }
      console.log(`Created course: ${c.title}`);
    }
  }

  // --- Default site (landing page) settings ---
  let settings = await settingsRepo.findOne({ where: { id: 1 } });
  if (!settings) {
    settings = settingsRepo.create({
      id: 1,
      siteName: 'FutureLearn Academy',
      currency: 'DZD',
      heroBadge: 'Inscriptions ouvertes',
      heroTitle: 'Développez de vraies compétences numériques',
      heroTitleHighlight: 'pour votre avenir',
      heroDescription:
        "Apprenez la programmation, le design et l'entrepreneuriat grâce à des formations en ligne données par des experts, avec des projets concrets — en Algérie, en dinars.",
      ctaTitle: 'Prêt à construire votre avenir ?',
      ctaDescription: 'Rejoignez les apprenants qui développent dès aujourd’hui les compétences qui comptent.',
      features: [
        { title: 'Formateurs experts', description: 'Des cours conçus et animés par des professionnels en activité.' },
        { title: 'Projets concrets', description: 'Construisez un portfolio réel tout au long de votre formation.' },
        { title: 'Paiement en dinars', description: 'Des tarifs pensés pour le marché algérien, sans surprise.' },
        { title: 'Certificats reconnus', description: 'Obtenez un certificat à la fin de chaque parcours complété.' },
      ],
      testimonials: [],
      contactEmail: 'contact@futurelearn.dz',
      contactPhone: '+213 555 00 00 00',
      city: 'Alger, Algérie',
      footerTagline: 'La plateforme algérienne de formation aux métiers du numérique.',
    });
    await settingsRepo.save(settings);
    console.log('Created default site settings (editable from the admin panel).');
  }

  console.log('\nSeed complete.');
  console.log('Admin login: admin@futurelearn.dz / Admin@2026');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
