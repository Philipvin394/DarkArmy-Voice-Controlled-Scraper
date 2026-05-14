# DarkArmy Voice-Controlled Scraper

AI-driven voice command center for cybersecurity investigations, OSINT automation, and threat intelligence workflows.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Create the database table:

   ```sql
   CREATE TABLE results (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     url TEXT,
     title TEXT,
     keywords TEXT[],
     tags TEXT[],
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
