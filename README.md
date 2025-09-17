# Buyers-Lead

A full-stack **Buyer Lead Intake App** built with **Next.js (App Router)**, **TypeScript**, **Postgres + Prisma**, **Tailwind CSS**, and **Firebase Authentication (Magic Link)**.

---

## 🚀 Features

- 📥 Add / Edit / Delete buyer leads  
- 📋 Paginated lead listing  
- 🔍 Search & filter (by name, email, phone, etc.)  
- 👤 Ownership-based editing (user can only edit their leads)  
- 🗄️ PostgreSQL + Prisma ORM for persistence  
- 🎨 Tailwind CSS styling  
- 🔑 Firebase Authentication with Magic Link  
- 📦 CSV import/export support (WIP)  

---
## Screenshots

### Homepage
![Homepage](assets/form.png)

### Buyers Page
![Buyers Page](assets/leads.png)

### Dashboard
![Dashboard](assets/dashboard.png)

### Login
![Login](assets/login.png)

## 🛠 Tech Stack

- **Frontend & Backend**: [Next.js 15 (App Router)](https://nextjs.org/) + TypeScript  
- **Database**: PostgreSQL + Prisma ORM  
- **Authentication**: Firebase (Email Magic Link)  
- **Styling**: Tailwind CSS + PostCSS  
- **Deployment**: Vercel (recommended)  

---

## 📂 Project Structure

Buyers-lead/
│── prisma/ # Prisma schema & migrations
│ └── schema.prisma
│
│── app/ # Next.js App Router
│ ├── api/ # API routes
│ │ ├── buyers/ # CRUD for buyers
│ │ └── auth/ # Firebase auth endpoints
│ ├── buyers/ # Buyer pages
│ ├── login/ # Login page
│ ├── layout.tsx
│ └── page.tsx
│
│── components/ # Reusable UI components
│ ├── BuyerTable.tsx
│ └── Pagination.tsx
│
│── contexts/ # React contexts (Auth provider, etc.)
│── lib/ # Helpers (Prisma client, CSV parser, Firebase utils)
│── public/ # Static assets
│── styles/ # Global styles
│
│── .env.local # Environment variables
│── next.config.ts
│── postcss.config.mjs
│── tailwind.config.ts
│── tsconfig.json
│── package.json
└── README.md

yaml
Copy code

---

## ⚙️ Setup & Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/suryapratap64/Buyers-lead.git
cd Buyers-lead
2. Install dependencies
bash
Copy code
npm install
3. Configure environment variables
Create a .env.local file in the project root:

env
Copy code
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Firebase Auth
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
4. Setup Prisma & Database
bash
Copy code
npx prisma generate
npx prisma migrate dev --name init
(Optional: seed database)

bash
Copy code
npx prisma db seed
5. Run the development server
bash
Copy code
npm run dev
Visit 👉 http://localhost:3000

🔑 Authentication (Firebase Magic Link)
Go to Firebase Console

Create a new project → Enable Email Link Authentication under Authentication > Sign-in method

Copy your Firebase config to .env.local

While developing, use Firebase Auth Emulator to avoid free plan quota issues:

bash
Copy code
firebase emulators:start --only auth
📊 Database & Prisma
Prisma schema defined in /prisma/schema.prisma

Run migrations with npx prisma migrate dev

Seed data via prisma/seed.ts

✅ Implemented Features
 Buyer CRUD (Create, Read, Update, Delete)

 Pagination in BuyerTable

 Search & filter functionality

 Firebase Magic Link login

 Tailwind-based UI

 Ownership control (buyers linked to user)

⚠️ Known Issues
Firebase Spark plan limits email link sign-ins (~333/day). Use Auth Emulator during development.

Some TypeScript type warnings still need cleanup.

CSV import/export partially implemented.

🚧 Future Improvements
✅ Stronger form validation with Zod

✅ Better error handling & UI feedback

✅ Complete CSV import/export

✅ Advanced filtering & sorting

✅ Tests (unit + integration)

✅ CI/CD pipeline with GitHub Actions

📜 License
MIT © Surya Pratap Singh

yaml
Copy code

---

Would you like me to also **add example screenshots & usage GIFs section** in the README (with placeholders), so the file looks even more professional for internship reviewers?






