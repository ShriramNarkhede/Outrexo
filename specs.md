### 2. SPECIFICATION.md
*Use this for understanding the backend logic and data flow.*

```markdown
# 📂 Outrexo Technical Specification

## 1. System Architecture
Outrexo operates as a **Serverless Web Application** leveraging the Next.js App Router.

- **Client:** React Server Components (RSC) for performance, Client Components for interactivity.
- **Server:** Next.js Route Handlers (`/api/*`) manage authentication and email dispatching.
- **State Management:** React Context / Zustand for managing the active "Campaign Queue."

## 2. Functional Modules

### A. Authentication (Security Core)
- **Library:** NextAuth.js
- **Strategy:** OAuth 2.0
- **Scopes:**
  - `https://www.googleapis.com/auth/gmail.send` (Send permissions)
  - `https://www.googleapis.com/auth/userinfo.profile` (User identity)
- **Security:** Access tokens are encrypted and stored in HTTP-Only cookies.

### B. The Parsing Engine
- **Logic:** Client-side parsing (to reduce server load).
- **Supported Formats & Libraries:**
  - **CSV:** `papaparse` (Auto-header detection).
  - **Excel:** `xlsx` (SheetJS).
  - **PDF:** `pdf-parse` (Text extraction for copy-pasting).
- **Validation:** The system runs a regex check on the `Email` column. Invalid rows are flagged visually in red.

### C. The Dispatcher (Sending Logic)
- **Rate Limiting:** To avoid Gmail spam triggers, the dispatcher uses a randomized delay:
  ```javascript
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  await delay(Math.random() * 1000 + 1500); // 1.5s - 2.5s wait per email
  ```
- **Token Refresh:** Middleware checks if the OAuth token is expired before sending and refreshes it automatically using the Refresh Token.

## 3. Data Dictionary

### User Data (Session)
```typescript
interface SessionUser {
  name: string;
  email: string;
  image: string;
  accessToken: string; // Used for Gmail API calls
}
```

### Campaign Contact
```typescript
interface Contact {
  id: string;
  email: string;
  name: string;
  company?: string;
  role?: string;
  status: 'idle' | 'queued' | 'sent' | 'failed';
  errorMsg?: string;
}
```

## 4. API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/auth/[...nextauth]` | Handles Google Login/Logout. |
| POST | `/api/send` | Accepts `{ recipient, template, token }` and sends 1 email. |
| POST | `/api/parse/pdf` | Extracts raw text from uploaded PDF files. |
```

---

### 3. DESIGN_SYSTEM.md
*Use this to ensure your CSS matches the "Vortasky" look.*

```markdown
# 🎨 Outrexo Design System

**Aesthetic:** "Futuristic SaaS" / "Dark Mode Precision"
**Reference:** Vortasky AI (Dribbble Concept)

## 1. Color Palette (Tailwind Config)

Copy these values into your `src/app/globals.css` (Tailwind v4 Theme):

```css
@theme {
  --color-background: #090504;      /* Deepest Charcoal (Main BG) */
  --color-surface: #13131F;         /* Lighter tint (Cards/Sidebar) */
  --color-surfaceHighlight: #1F1F2E; /* Hover state for cards */
  --color-primary: #664FC7;         /* "Outrexo Purple" (Main Action) */
  --color-primaryGlow: #8B7FD9;     /* Glow effects */
  --color-secondary: #00f2ff;       /* Cyan/Teal (Accents) - Updated from Gold */
  --color-text-main: #ECE9E8;       /* Off-white */
  --color-text-muted: #9CA3AF;      /* Gray text */
  --color-border: rgba(255, 255, 255, 0.08); /* Subtle borders */
  --font-inter: var(--font-inter);  /* Font family */
}
```

## 2. Typography
- **Font:** Inter (Standard) or DM Sans (More tech-focused).
- **Weights:**
  - Headers: Bold (700)
  - UI Labels: Medium (500)
  - Body: Regular (400)

## 3. UI Components

### A. The "Glass" Container
Used for the main dashboard metrics and form wrappers.
```css
/* Tailwind Class Equivalent */
.glass-panel {
  @apply bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl;
}
```

### B. The "Neon" Action Button
Used for the "Send Campaign" or "Connect Gmail" buttons.
```css
.btn-neon {
  @apply bg-[#664FC7] text-white px-6 py-3 rounded-lg font-bold transition-all duration-300;
  box-shadow: 0 4px 15px rgba(102, 79, 199, 0.4);
}
.btn-neon:hover {
  @apply transform -translate-y-0.5 bg-[#755edb];
  box-shadow: 0 0 25px rgba(102, 79, 199, 0.6);
}
```

### C. Input Fields
Inputs should feel spacious and "floating."
```css
.input-field {
  @apply w-full bg-white/5 border border-white/10 text-white rounded-lg p-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder-gray-500;
}
```

## 4. Animation Guidelines (Framer Motion)
- **Page Load:** Content should fade in and slide up (`y: 20` to `y: 0`).
- **Hover Effects:** Cards should scale up slightly (`scale: 1.02`) on hover.
- **Sidebar:** Should slide in from the left with a spring transition type.
```
