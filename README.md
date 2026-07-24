# FutureLearn Academy 🚀

Plateforme de formation en ligne — **Next.js 14 + NestJS + PostgreSQL**

![Dark Theme](https://img.shields.io/badge/Theme-Dark-6C47FF?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square)

---

## 📁 Structure

```
futurelearn/
├── frontend/          # Next.js 14 App Router
└── backend/           # NestJS API
```

---

## 🚀 Démarrage (PostgreSQL local via pgAdmin)

### 1. Créer la base de données avec pgAdmin

1. Ouvre **pgAdmin**
2. Connecte-toi à ton serveur PostgreSQL local (`localhost:5432`)
3. Clic droit sur **Databases** → **Create** → **Database...**
4. Nom de la base : `futurelearn`
5. Clique sur **Save**

> ℹ️ Aucun script SQL à exécuter manuellement : TypeORM crée automatiquement
> toutes les tables (users, courses, lessons, enrollments, progress, certificates)
> au premier démarrage du backend grâce à `synchronize: true` (mode développement).

---

### 2. Backend (NestJS)

```bash
cd backend
cp .env.example .env
```

Édite `.env` avec **tes identifiants pgAdmin / PostgreSQL** :

```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=ton_mot_de_passe_postgres
DB_NAME=futurelearn

JWT_SECRET=change-this-secret-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

Puis :

```bash
npm install
npm run start:dev
```

✅ Console attendue :
```
🚀 FutureLearn API running on: http://localhost:3001
📚 Swagger docs: http://localhost:3001/api/docs
```

Dans pgAdmin → `futurelearn` → `Schemas` → `public` → `Tables`,
tu verras apparaître : `users`, `courses`, `lessons`, `enrollments`, `progress`, `certificates`, `site_settings`.

### 2bis. Peupler la base avec des données réelles de lancement

Le compte admin, les formateurs et les premières formations (en dinars algériens) ne sont **pas codés en dur dans le frontend** :
ils sont créés dans la base de données par un script de seed, que vous pouvez modifier ou ré-exécuter à volonté.

```bash
cd backend
npm run seed
```

Cela crée (ou met à jour si déjà présents) :
- Un compte **admin** : `admin@futurelearn.dz` / `Admin@2026` *(changez ce mot de passe après la première connexion, depuis `/dashboard/admin/users`)*
- Deux comptes **formateur** de démonstration
- Quatre formations réelles avec leurs leçons, en **DZD**
- Le contenu par défaut de la page d'accueil (modifiable ensuite depuis `/dashboard/admin/settings`)

Tout ce que le script crée est ensuite **entièrement gérable depuis le panneau admin** (modification, suppression, publication/dépublication, ajout de leçons, etc.). Rien n'est figé côté frontend.

---

### 3. Frontend (Next.js)

Dans un **nouveau terminal** :

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

➡️ **http://localhost:3000**

---

## 🔑 Variables d'environnement

### `backend/.env`

| Variable | Description | Exemple |
|---|---|---|
| `DB_HOST` | Hôte PostgreSQL | `localhost` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `DB_USERNAME` | Utilisateur (visible dans pgAdmin) | `postgres` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | `ton_mdp` |
| `DB_NAME` | Nom de la base créée | `futurelearn` |
| `JWT_SECRET` | Clé secrète JWT | chaîne aléatoire |
| `JWT_EXPIRES_IN` | Durée du token | `7d` |
| `FRONTEND_URL` | URL frontend (CORS) | `http://localhost:3000` |

### `frontend/.env.local`

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` |

---

## 💰 Devise et paiement

Toute la plateforme fonctionne en **dinar algérien (DZD)** : prix des formations, affichage, chiffre d'affaires dans les statistiques admin, etc.

⚠️ **Important** : l'inscription à une formation (`Enroll`) confirme immédiatement l'accès — il n'y a **pas de passerelle de paiement réelle intégrée** (pas de CIB/Edahabia, pas de Stripe). Le prix affiché est bien réel et vient de la base de données, mais aucun paiement n'est effectivement collecté au clic sur "S'inscrire". Pour un lancement commercial, il faut brancher un vrai prestataire de paiement algérien (SATIM/CIB, Edahabia, ou un agrégateur comme Chargily/Slick-Pay) avant l'ouverture au public, ou gérer les paiements hors-ligne (virement, versement) et activer l'accès manuellement depuis l'admin.

---

## 🚀 Déploiement (hébergement mutualisé + PM2)

```bash
# Backend
cd backend
npm install
npm run build        # compile dans dist/
npm run seed          # une seule fois, pour créer l'admin et le contenu initial
pm2 start dist/main.js --name futurelearn-api

# Frontend
cd frontend
npm install
npm run build
pm2 start npm --name futurelearn-web -- start
```

Pensez à configurer `backend/.env` (base de données, `JWT_SECRET`, `FRONTEND_URL`) et `frontend/.env.local` (`NEXT_PUBLIC_API_URL`) avec les vraies valeurs de production avant de démarrer PM2.

---

## 🩺 Dépannage connexion PostgreSQL

Erreur `ECONNREFUSED` ou `password authentication failed` :

1. Vérifie que le serveur PostgreSQL est connecté dans pgAdmin (icône verte)
2. Vérifie le port (clic droit sur le serveur → Properties → Connection)
3. Vérifie `DB_USERNAME` / `DB_PASSWORD` (ceux utilisés pour pgAdmin)
4. Vérifie que la base `futurelearn` existe (étape 1)

---

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page (contenu géré depuis l'admin) |
| `/register` | Création de compte (Student / Instructor) |
| `/login` | Connexion |
| `/courses` | Liste des cours |
| `/courses/[id]` | Détail cours + inscription + lecteur vidéo |
| `/dashboard/student` | Tableau de bord étudiant |
| `/dashboard/student/courses` | Mes cours |
| `/dashboard/instructor` | Tableau de bord instructeur |
| `/dashboard/instructor/courses` | Gestion des cours |
| `/dashboard/instructor/courses/new` | Créer un cours |
| `/dashboard/instructor/students` | Étudiants inscrits |
| `/dashboard/admin` | Tableau de bord admin |
| `/dashboard/admin/courses` | Gestion de toutes les formations |
| `/dashboard/admin/users` | Gestion des utilisateurs et rôles |
| `/dashboard/admin/analytics` | Statistiques réelles de la plateforme |
| `/dashboard/admin/settings` | Contenu de la page d'accueil (CMS) |
| `/profile` | Profil (étudiant / instructeur / admin) |

---

## 🛠 API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Courses
```
GET    /api/courses
GET    /api/courses/:id
GET    /api/courses/my
GET    /api/courses/admin/all        (admin)
POST   /api/courses
PATCH  /api/courses/:id
DELETE /api/courses/:id
```

### Users
```
GET    /api/users                    (admin, instructor)
GET    /api/users/stats
GET    /api/users/admin/overview     (admin — real platform-wide stats)
PATCH  /api/users/me
PATCH  /api/users/:id                (admin — change role, etc.)
DELETE /api/users/:id                (admin)
```

### Site settings (landing page CMS)
```
GET   /api/settings                  (public — hero/features/testimonials + live stats)
PATCH /api/settings                  (admin)
```

### Enrollments
```
POST /api/enrollments/:courseId
GET  /api/enrollments/my
```

### Progress
```
POST /api/progress/lesson/:id/complete
GET  /api/progress/velocity
```

### Certificates
```
POST /api/certificates/issue/:courseId
GET  /api/certificates/my
```

---

## 🎨 Design System

```
Background:  #0D0D1A
Surface:     #12121F
Card:        #1A1A2E
Border:      #2A2A45
Primary:     #6C47FF
Accent Blue: #4F8EF7
Text:        #FFFFFF
Text Muted:  #A0A0C0
```

---

## 📦 Tech Stack

**Frontend** — Next.js 14, TypeScript, Tailwind CSS, Zustand, TanStack Query v5, React Hook Form + Zod, Lucide React, Sonner

**Backend** — NestJS 10, TypeORM, PostgreSQL, JWT, Passport.js, Swagger, bcryptjs

---

*© 2024 FutureLearn Academy — Engineering excellence through precision code.*
