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
tu verras apparaître : `users`, `courses`, `lessons`, `enrollments`, `progress`, `certificates`.

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
| `/` | Landing page |
| `/register` | Création de compte (Student / Instructor) |
| `/login` | Connexion |
| `/courses` | Liste des cours |
| `/courses/[id]` | Détail cours + vidéo player |
| `/dashboard/student` | Tableau de bord étudiant |
| `/dashboard/student/courses` | Mes cours |
| `/dashboard/instructor` | Tableau de bord instructeur |
| `/dashboard/instructor/courses` | Gestion des cours |
| `/dashboard/instructor/courses/new` | Créer un cours |
| `/profile` | Profil étudiant complet |
| `/ai-assistant` | Mentor IA (Anthropic Claude) |

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
POST   /api/courses
PATCH  /api/courses/:id
DELETE /api/courses/:id
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
