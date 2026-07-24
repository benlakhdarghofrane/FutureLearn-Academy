import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

export interface FeatureItem {
  title: string;
  description: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  text: string;
}

@Entity('site_settings')
export class SiteSetting {
  // Singleton row
  @PrimaryColumn({ default: 1 })
  id: number;

  @Column({ default: 'FutureLearn Academy' })
  siteName: string;

  @Column({ default: 'DZD' })
  currency: string;

  // Hero section
  @Column({ default: 'Inscriptions ouvertes' })
  heroBadge: string;

  @Column({ default: 'Développez de vraies compétences numériques' })
  heroTitle: string;

  @Column({ default: 'pour votre avenir' })
  heroTitleHighlight: string;

  @Column({
    type: 'text',
    default:
      'Apprenez la programmation, le design et l’entrepreneuriat grâce à des formations en ligne, des mentors experts, des projets concrets et un accompagnement carrière — en Algérie, en dinars.',
  })
  heroDescription: string;

  // Call to action
  @Column({ default: 'Prêt à construire votre avenir ?' })
  ctaTitle: string;

  @Column({ default: 'Rejoignez les apprenants qui développent les compétences qui comptent.' })
  ctaDescription: string;

  // Features ("Why choose us")
  @Column({ type: 'jsonb', default: () => "'[]'" })
  features: FeatureItem[];

  // Testimonials (populated by admin with real students only)
  @Column({ type: 'jsonb', default: () => "'[]'" })
  testimonials: TestimonialItem[];

  // Contact / footer
  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: 'Alger, Algérie' })
  city: string;

  @Column({ type: 'text', nullable: true })
  footerTagline: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
