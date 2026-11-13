# 🎬 StudioSpace — Creative Workspace & Studio Booking Platform

**StudioSpace** is a modern full-stack web application designed for photographers, filmmakers, podcasters, musicians, and content creators to discover, book, and manage creative studio spaces. Studio owners can also list their workspaces, manage availability, and track bookings through a dedicated creator dashboard.

🌐 **Live Website:** [https://studiospace-beta.vercel.app/](https://studiospace-beta.vercel.app/)  
⚙️ **Backend API:** [https://a8-server-2lig.onrender.com](https://a8-server-2lig.onrender.com)

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Multi-Provider Authentication:** Powered by **Better Auth** supporting both **Email & Password** registration/login and **Google OAuth 2.0** sign-in.
- **JWT Session Protection:** Integrated Better Auth JWT plugin (`jwt` & `jwtClient`) for secure client-server communication and protected routes.
- **Form Validation & Feedback:** Real-time password strength rules, validation checks, and toast notifications.

### 🏢 Studio Discovery & Booking
- **Explore Studios:** Browse available studios with dynamic search, category filtering, and detailed workspace specifications.
- **Studio Details View:** Comprehensive studio pages displaying hourly/daily pricing, amenities, location, host details, and high-resolution previews.
- **Seamless Booking System:** Authenticated creators can book studios directly and manage all reservations under **My Bookings**.

### 🛠️ Creator & Host Management
- **List a Studio (`/add-studio`):** Studio owners can publish new creative spaces with custom image uploads powered by **ImgBB API**.
- **Manage Listings (`/my-listings` & `/studios/edit/[id]`):** Full CRUD functionality allowing hosts to update studio details or remove listings.
- **Creator Dashboard (`/dashboard`):** Centralized overview of booked stages, studio listings, and account activity.

### 🎨 UI/UX & Accessibility
- **Responsive Design:** Built mobile-first with **Tailwind CSS**, ensuring smooth usability across mobile, tablet, and desktop screens.
- **Dark & Light Mode:** Built-in theme switcher for comfortable viewing in any lighting environment.

---

## 🧰 Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js (App Router), React, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (MongoDB Atlas Native Driver) |
| **Authentication** | Better Auth (`@better-auth/mongo-adapter`, Google OAuth, JWT Plugin) |
| **Image Hosting** | ImgBB API |
| **Deployment** | Vercel (Frontend) & Render (Backend) |

---

## 📁 Project Structure

```text
StudioSpace/
├── client/
│   ├── public/
│   ├── src/
│   │   └── app/
│   │       ├── add-studio/          # Create new studio listing page
│   │       ├── api/auth/[...all]/   # Better Auth API route handler
│   │       ├── components/          # Reusable UI components (Navbar, Footer, Cards)
│   │       ├── dashboard/           # User & host overview dashboard
│   │       ├── lib/
│   │       │   ├── api.js           # Backend API fetch helpers
│   │       │   ├── auth.js          # Better Auth server & MongoDB adapter config
│   │       │   ├── auth-client.js   # Better Auth React & JWT client config
│   │       │   └── imgbb.js         # ImgBB image upload utility
│   │       ├── login/               # Login page (Email + Google OAuth)
│   │       ├── my-bookings/         # User's booked studios page
│   │       ├── my-listings/         # Host's created studio listings
│   │       ├── register/            # User registration page
│   │       ├── studios/
│   │       │   ├── [id]/            # Dynamic studio details & booking page
│   │       │   ├── edit/[id]/       # Edit existing studio listing
│   │       │   └── page.jsx         # Explore all studios with filters
│   │       ├── globals.css          # Global styles & Tailwind configuration
│   │       ├── layout.js            # Root layout with theme & providers
│   │       └── page.js              # Landing / Home page
│   ├── next.config.mjs
│   └── package.json
└── server/
    ├── index.js                     # Express server & MongoDB REST API endpoints
    └── package.json