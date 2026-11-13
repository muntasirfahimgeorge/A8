# StudioSpace — Peer-to-Peer Creative Studio & Production Marketplace

**StudioSpace** is a full-stack peer-to-peer marketplace where photographers, filmmakers, podcasters, and musicians can discover, compare, and book vetted creative studios by the hour—and studio owners can list and manage their spaces seamlessly.

---

## Live Links & Repositories

- **Live Website (Frontend):** [https://studiospace-beta.vercel.app](https://studiospace-beta.vercel.app)
- **Live API Server (Backend):** [https://a8-server-2lig.onrender.com](https://a8-server-2lig.onrender.com)
- **Client GitHub Repository:** [https://github.com/muntasirfahimgeorge/A8](https://github.com/muntasirfahimgeorge/A8)
- **Server GitHub Repository:** [https://github.com/muntasirfahimgeorge/A8-server](https://github.com/muntasirfahimgeorge/A8-server)

---

## Key Features

- **Curated Studio Discovery:** Browse daylight lofts, cyclorama stages, recording booths, and production spaces with category filters, search, and sorting.
- **Real-Time Slot & Double-Booking Protection:** Interactive hourly date/time scheduling with server-side conflict checks to prevent overlapping reservations.
- **Hybrid Authentication & Security:** Powered by **Better Auth** supporting Email/Password and **Google OAuth**, paired with HTTPOnly JWT cookie synchronization between Next.js and Express.js.
- **Host Space Management:** Authenticated creators can list new studios with direct **ImgBB** image uploads, update pricing/amenities, and manage their active listings.
- **User Dashboard & Booking History:** View upcoming and past studio reservations with instant status updates and cancellation controls.
- **Responsive Modern UI:** Built with Tailwind CSS for a clean, accessible experience across desktop, tablet, and mobile devices.

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS, Better Auth
- **Backend:** Node.js, Express.js, JWT / JWKS Verification
- **Database:** MongoDB (Native Driver / Atlas)
- **Media & Hosting:** ImgBB API, Vercel (Client), Render (Server)

---

## Local Setup & Installation

### 1. Clone Both Repositories
```bash
git clone [https://github.com/muntasirfahimgeorge/A8.git](https://github.com/muntasirfahimgeorge/A8.git)
git clone [https://github.com/muntasirfahimgeorge/A8-server.git](https://github.com/muntasirfahimgeorge/A8-server.git)