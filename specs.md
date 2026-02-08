### 2. `SPECIFICATION.md`
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
Token Refresh: Middleware checks if the OAuth token is expired before sending and refreshes it automatically using the Refresh Token.3. Data DictionaryUser Data (Session)TypeScriptinterface SessionUser {
  name: string;
  email: string;
  image: string;
  accessToken: string; // Used for Gmail API calls
}
Campaign ContactTypeScriptinterface Contact {
  id: string;
  email: string;
  name: string;
  company?: string;
  role?: string;
  status: 'idle' | 'queued' | 'sent' | 'failed';
  errorMsg?: string;
}
4. API EndpointsMethodEndpointDescriptionGET/api/auth/[...nextauth]Handles Google Login/Logout.POST/api/sendAccepts { recipient, template, token } and sends 1 email.POST/api/parse/pdfExtracts raw text from uploaded PDF files.
---

### 3. `DESIGN_SYSTEM.md`
*Use this to ensure your CSS matches the "Vortasky" look.*

```markdown
# 🎨 Outrexo Design System

**Aesthetic:** "Futuristic SaaS" / "Dark Mode Precision"
**Reference:** Vortasky AI (Dribbble Concept)

## 1. Color Palette (Tailwind Config)

Copy these values into your `tailwind.config.ts`:

```javascript
colors: {
  background: '#090504',      // Deepest Charcoal (Main BG)
  surface: '#13131F',         // Lighter tint (Cards/Sidebar)
  surfaceHighlight: '#1F1F2E', // Hover state for cards
  primary: '#664FC7',         // "Outrexo Purple" (Main Action)
  primaryGlow: '#8B7FD9',     // Glow effects
  secondary: '#C6A24E',       // Gold (Alerts/Premium)
  text: {
    main: '#ECE9E8',          // Off-white
    muted: '#9CA3AF',         // Gray text
  },
  border: 'rgba(255,255,255,0.08)', // Subtle borders
}
2. TypographyFont: Inter (Standard) or DM Sans (More tech-focused).Weights:Headers: Bold (700)UI Labels: Medium (500)Body: Regular (400)3. UI ComponentsA. The "Glass" ContainerUsed for the main dashboard metrics and form wrappers.CSS/* Tailwind Class Equivalent */
.glass-panel {
  @apply bg-surface/70 backdrop-blur-md border border-border rounded-2xl shadow-xl;
}
B. The "Neon" Action ButtonUsed for the "Send Campaign" or "Connect Gmail" buttons.CSS.btn-neon {
  @apply bg-primary text-white px-6 py-3 rounded-lg font-bold transition-all duration-300;
  box-shadow: 0 0 15px rgba(102, 79, 199, 0.4);
}
.btn-neon:hover {
  @apply transform -translate-y-1;
  box-shadow: 0 0 25px rgba(102, 79, 199, 0.7);
}
C. Input FieldsInputs should feel spacious and "floating."CSS.input-field {
  @apply w-full bg-[#0F0F16] border border-border text-text-main rounded-lg p-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all;
}
4. Animation Guidelines (Framer Motion)Page Load: Content should fade in and slide up (y: 20 to y: 0).Hover Effects: Cards should scale up slightly (scale: 1.02) on hover.Sidebar: Should slide in from the left with a spring transition type.