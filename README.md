

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Supabase Auth (password-based)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Charts**: Chart.js with react-chartjs-2
- **State Management**: TanStack Query (React Query)

## Prerequisites

- Node.js 20+
- npm, yarn, or pnpm
- Supabase account and project

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd shelfcontrolapp
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Get these values from your [Supabase project's API settings](https://supabase.com/dashboard/project/_/settings/api).

### 4. Set up Supabase database

Run the database migrations to create the necessary tables:
- Books table with deadline tracking
- User profiles with reading preferences
- Reading sessions for speed calculation
- Review platform tracking

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run types:supabase` - Generate TypeScript types from Supabase schema

## Project Structure

```
shelfcontrolapp/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard and analytics
│   ├── protected/         # Protected user routes
│   ├── privacy-policy/    # Legal pages
│   └── terms/
├── components/
│   ├── landing/           # Landing page components
│   ├── ui/                # shadcn/ui components
│   └── [auth forms]       # Authentication components
├── lib/
│   └── supabase/          # Supabase client configuration
└── public/                # Static assets
```

## Authentication Flow

The app uses Supabase Auth with cookie-based sessions that work across:
- Client Components
- Server Components
- Route Handlers
- Server Actions
- Middleware

## Development

### Adding new UI components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add [component-name]
```

### Database type generation

After making schema changes in Supabase, regenerate TypeScript types:

```bash
npm run types:supabase
```

## Deployment

### Deploy to Vercel

The easiest way to deploy is using the Vercel Platform:

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Vercel will automatically detect Next.js and configure the build.

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Contributing

This is a personal project, but feedback and suggestions are welcome via issues.

## License

Private project - All rights reserved
