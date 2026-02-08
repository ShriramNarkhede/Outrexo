# Outrexo

Outrexo is a modern, high-performance email campaign management platform designed for efficiency and ease of use. It features a sleek "Dark SaaS" UI, real-time analytics, and robust campaign orchestration capabilities.

## Features

- **Campaign Management**: Create, schedule, and track email campaigns.
- **Template System**: Reusable email templates with rich text support.
- **Real-time Analytics**: Track sending progress, success rates, and failures live.
- **Modern UI**: Built with a futuristic dark theme using Tailwind CSS 4 and Framer Motion.
- **Secure Authentication**: integrated with Google OAuth via NextAuth.js.

## Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: Next.js API Routes, Server Actions
- **Database**: [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
- **Email Service**: Google Gmail API

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Google Cloud Console project (for OAuth and Gmail API)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ShriramNarkhede/Outrexo.git
    cd Outrexo
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    # Database Connection
    DATABASE_URL="postgresql://user:password@localhost:5432/outrexo?schema=public"

    # NextAuth / Auth.js
    AUTH_SECRET="your-generated-secret" # Run `npx auth secret` to generate
    AUTH_URL="http://localhost:3000" # Optional in Vercel, required locally often

    # Google OAuth & Gmail API
    GOOGLE_CLIENT_ID="your-google-client-id"
    GOOGLE_CLIENT_SECRET="your-google-client-secret"
    ```

4.  **Database Setup:**

    Push the Prisma schema to your database:

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: App Router pages and API routes.
  - `(auth)`: Login and authentication pages.
  - `(dashboard)`: Protected dashboard routes (Campaigns, Templates, Settings).
  - `api`: Backend API endpoints.
- `src/components`: Reusable UI components.
  - `ui`: Base UI elements (buttons, inputs, etc.).
  - `dashboard`: Dashboard-specific widgets.
  - `campaign`: Campaign creation and monitoring components.
- `src/lib`: Utility functions and centralized configuration (Prisma client, utils).
- `prisma`: Database schema and migrations.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Runs the built application.
- `npm run lint`: Runs ESLint.

## License

[MIT](LICENSE)