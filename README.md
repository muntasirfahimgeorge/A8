# StudioSpace — Creative Workspace & Studio Booking Platform

**StudioSpace** is a modern full-stack web application designed for photographers, filmmakers, podcasters, musicians, and content creators to discover, book, and manage creative studio spaces. Studio owners can also list their workspaces, manage availability, and track bookings through a dedicated creator dashboard.

 **Live Website:** [https://studiospace-beta.vercel.app/](https://studiospace-beta.vercel.app/)  
 **Backend API:** [https://a8-server-2lig.onrender.com](https://a8-server-2lig.onrender.com)

---

## Key Features

### Authentication & Security
- **Multi-Provider Authentication:** Powered by **Better Auth** supporting both **Email & Password** registration/login and **Google OAuth 2.0** sign-in.
- **JWT Session Protection:** Integrated Better Auth JWT plugin (`jwt` & `jwtClient`) for secure client-server communication and protected routes.
- **Form Validation & Feedback:** Real-time password strength rules, validation checks, and toast notifications.

### Studio Discovery & Booking
- **Explore Studios:** Browse available studios with dynamic search, category filtering, and detailed workspace specifications.
- **Studio Details View:** Comprehensive studio pages displaying hourly/daily pricing, amenities, location, host details, and high-resolution previews.
- **Seamless Booking System:** Authenticated creators can book studios directly and manage all reservations under **My Bookings**.

### Creator & Host Management
- **List a Studio (`/add-studio`):** Studio owners can publish new creative spaces with custom image uploads powered by **ImgBB API**.
- **Manage Listings (`/my-listings` & `/studios/edit/[id]`):** Full CRUD functionality allowing hosts to update studio details or remove listings.
- **Creator Dashboard (`/dashboard`):** Centralized overview of booked stages, studio listings, and account activity.

### UI/UX & Accessibility
- **Responsive Design:** Built mobile-first with **Tailwind CSS**, ensuring smooth usability across mobile, tablet, and desktop screens.
- **Dark & Light Mode:** Built-in theme switcher for comfortable viewing in any lighting environment.

---

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | Next.js (App Router), React, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (MongoDB Atlas Native Driver) |
| **Authentication** | Better Auth (`@better-auth/mongo-adapter`, Google OAuth, JWT Plugin) |
| **Image Hosting** | ImgBB API |
| **Deployment** | Vercel (Frontend) & Render (Backend) |

---

##  Project Structure

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


 Local Setup & Installation
Follow these steps to run both the client and server locally on your machine:

Prerequisites
Node.js (v18 or higher)

MongoDB Atlas cluster (or local MongoDB instance)

Google Cloud Console OAuth 2.0 Client ID & Secret

ImgBB API Key

1. Clone the Repositories
# Clone the client repository
git clone https://github.com/your-username/studiospace-client.git

# Clone the server repository
git clone https://github.com/your-username/studiospace-server.git

2. Setup & Run the Backend Server
cd studiospace-server
npm install

Create a .env file in the server root directory and add:

PORT=8000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=StudioSpace
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000

Start the Express server:

npm run dev

The server will run at http://localhost:8000.

3. Setup & Run the Frontend Client
cd ../studiospace-client
npm install

Create a .env.local file in the client root directory and add:

BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret_key

MONGODB_URI=your_mongodb_connection_string
DB_NAME=StudioSpace

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

NEXT_PUBLIC_SERVER_URL=http://localhost:8000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

Start the Next.js development server:

npm run dev

Open http://localhost:3000 in your browser to view the application.

 Author
Muntasir Fahim

Live Application: https://studiospace-beta.vercel.app/