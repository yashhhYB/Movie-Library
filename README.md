# Cinema - Discover Your Next Favorite Movie

## Overview

Cinema is a modern, responsive web application designed for movie enthusiasts to browse, search, discover, and manage their favorite films. Built from scratch using React and TypeScript, this project provides an intuitive interface for exploring movies powered by the TMDB (The Movie Database) API. Users can get personalized mood-based recommendations, add movies to watchlists and favorites, view detailed movie information, and more. The app integrates with Supabase for backend services like user authentication and data persistence.

This project was developed manually using standard web development practices, focusing on clean code, performance, and user experience. It leverages modern frontend tools and libraries to create a fast, scalable single-page application (SPA).

## Features

- **Movie Discovery**: Browse popular, top-rated, and now-playing movies with rich previews and posters.
- **Search Functionality**: Real-time search for movies by title, with debounced input for optimal performance.
- **Mood-Based Recommendations**: Select your mood (e.g., happy, sad, action-packed) to get tailored movie suggestions.
- **Movie Details**: In-depth views of movie information, including cast, crew, reviews, and trailers.
- **Watchlist & Favorites**: Add/remove movies to personal lists, with badge counters in the navigation.
- **User Authentication**: Login/signup via Supabase for saving watchlists and favorites across sessions.
- **Responsive Design**: Fully mobile-friendly layout using Tailwind CSS and Shadcn/UI components.
- **Dark/Light Mode**: Theme switching support (via next-themes).
- **Offline Support**: Basic caching with TanStack Query for improved loading times.
- **Error Handling**: Graceful handling of API errors, loading states, and empty results.

## Technologies Used

### Frontend Framework & Build Tools
- **React 18**: Core library for building the UI components and managing state.
- **TypeScript**: For type safety, better developer experience, and reducing runtime errors.
- **Vite**: Fast build tool and dev server for hot module replacement (HMR) and optimized production builds.
- **React Router DOM v6**: Client-side routing for seamless navigation between pages (Home, Search, Mood, Watchlist, Favorites, Movie Details).

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework for rapid styling and responsive design.
- **Shadcn/UI**: Customizable, accessible UI components built on Radix UI and Tailwind (e.g., buttons, modals, cards, badges).
- **Lucide React**: Icon library for consistent, scalable icons (e.g., search, heart, film reel).
- **Class Variance Authority (CVA) & Tailwind Merge**: For dynamic class generation and merging Tailwind classes.

### State Management & Data Fetching
- **TanStack Query (React Query)**: For server-state management, caching, background updates, and optimistic updates when interacting with APIs.
- **React Hook Form & Zod**: Form handling and validation for search inputs and user forms.
- **React Context API**: Custom context (MovieContext) for sharing watchlist and favorites state across components.

### Backend & Integrations
- **Supabase**: Open-source Firebase alternative for authentication, real-time database, and storage. Used for user sessions, storing user-specific watchlists/favorites.
  - Client: `@supabase/supabase-js`
  - Types: Custom types for Supabase responses.
- **TMDB API**: Primary data source for movie information, posters, and metadata.
  - Endpoint examples: `/movie/popular`, `/search/movie`, `/movie/{id}`.
  - API Key: Stored in `.env` as `VITE_TMDB_API_KEY` (user must provide their own key).
- **Date-fns**: For date formatting in movie release dates.

### Utilities & Libraries
- **clsx & Tailwind Merge**: Conditional class names.
- **Sonner**: Toast notifications for user feedback (e.g., "Added to watchlist").
- **Recharts**: For potential chart visualizations (e.g., movie ratings trends, though not heavily used).
- **Embla Carousel**: For movie carousels on the home page.
- **React Day Picker**: Calendar component for date-based filters (if extended).
- **Zod**: Schema validation for API responses and forms.

### Development Tools
- **ESLint & TypeScript ESLint**: Code linting and formatting.
- **PostCSS & Autoprefixer**: CSS processing.
- **Vite Plugins**: `@vitejs/plugin-react-swc` for fast React compilation.

## Project Structure

```
moodlight-movies-main/
├── public/                  # Static assets
│   ├── movie-favicon.svg    # Custom movie clapperboard favicon
│   ├── placeholder.svg      # Image placeholders
│   └── robots.txt           # SEO basics
├── src/
│   ├── App.tsx              # Root component with routing setup
│   ├── main.tsx             # Entry point, renders App
│   ├── index.css            # Global styles (Tailwind imports)
│   ├── App.css              # App-specific styles
│   ├── components/          # Reusable UI components
│   │   ├── layout/          # Header, Footer
│   │   │   └── Header.tsx
│   │   ├── movie/           # Movie-specific components
│   │   │   ├── MovieCard.tsx
│   │   │   └── MovieGrid.tsx
│   │   └── ui/              # Shadcn/UI components (accordion, button, card, etc.)
│   ├── contexts/            # React Contexts
│   │   └── MovieContext.tsx # Manages watchlist/favorites state
│   ├── hooks/               # Custom hooks
│   │   ├── use-debounce.ts  # Debounced search
│   │   ├── use-mobile.ts    # Mobile detection
│   │   └── use-toast.ts     # Toast notifications
│   ├── integrations/        # External service clients
│   │   └── supabase/        # Supabase client and types
│   │       ├── client.ts
│   │       └── types.ts
│   ├── lib/                 # Utilities
│   │   └── utils.ts         # cn() function for class merging
│   ├── pages/               # Route components
│   │   ├── Home.tsx         # Featured movies, popular lists
│   │   ├── Search.tsx       # Search results page
│   │   ├── MoodRecommendations.tsx # Mood selector and results
│   │   ├── MovieDetails.tsx # Single movie view
│   │   ├── Watchlist.tsx    # User's watchlist
│   │   ├── Favorites.tsx    # User's favorites
│   │   └── NotFound.tsx     # 404 page
│   ├── services/            # API services
│   │   └── tmdbApi.ts       # TMDB API calls with TanStack Query
│   └── types/               # TypeScript definitions
│       └── movie.ts         # Movie-related interfaces
├── supabase/                # Supabase config
│   └── config.toml          # Project ID for Supabase
├── .env                     # Environment variables (TMDB key, Supabase URL/anon key)
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind setup
├── tsconfig.json            # TypeScript config
├── index.html               # HTML template with meta tags
└── README.md                # This file
```

## APIs and Integrations

### TMDB API
- **Base URL**: `https://api.themoviedb.org/3`
- **Key Features**:
  - Fetch popular movies: `GET /movie/popular?api_key=${key}&language=en-US&page=1`
  - Search movies: `GET /search/movie?api_key=${key}&query=${searchTerm}&page=1`
  - Movie details: `GET /movie/{id}?api_key=${key}&append_to_response=credits,videos,images`
  - Image base: `https://image.tmdb.org/t/p/w500/${posterPath}`
- **Rate Limits**: 40 requests per 10 seconds; handled via TanStack Query caching.
- **Setup**: Add your TMDB API key to `.env` as `VITE_TMDB_API_KEY=your_key_here`.

### Supabase
- **Project ID**: Configured in `supabase/config.toml`.
- **Client Setup**: In `src/integrations/supabase/client.ts` – initializes Supabase with URL and anon key from `.env`.
- **Usage**:
  - Authentication: `supabase.auth.signInWithPassword()`, `supabase.auth.signUp()`.
  - Database: Tables for users, watchlists, favorites (e.g., `insert into watchlists (user_id, movie_id)`).
  - Real-time: Subscriptions for live updates on lists.
- **Setup**: Create a Supabase project, add URL and anon key to `.env` (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## Setup Instructions

1. **Prerequisites**:
   - Node.js (v18+) and npm/yarn/pnpm installed.
   - TMDB API key (free from [themoviedb.org](https://www.themoviedb.org/)).
   - Supabase account and project (free tier sufficient from [supabase.com](https://supabase.com/)).

2. **Clone and Install**:
   ```
   git clone <your-repo-url>
   cd moodlight-movies-main
   npm install
   ```

3. **Environment Variables**:
   Create `.env` in the root:
   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server**:
   ```
   npm run dev
   ```
   - Opens at `http://localhost:8080/` (or port shown in terminal).
   - Hot reloading enabled for instant changes.

5. **Build for Production**:
   ```
   npm run build
   ```
   - Outputs to `dist/` folder.
   - Preview: `npm run preview`.

6. **Lint and Format**:
   ```
   npm run lint
   ```

## How I Built This Project

This app was built step-by-step as a full-stack frontend project:

1. **Initialization**: Started with Vite's React + TypeScript template (`npm create vite@latest`).
2. **Routing Setup**: Added React Router for multi-page SPA navigation.
3. **Styling**: Installed Tailwind CSS and Shadcn/UI for components (`npx shadcn-ui@latest init`).
4. **Data Fetching**: Integrated TanStack Query for TMDB API calls, with custom hooks for queries/mutations.
5. **State Management**: Used Context API for global state (watchlist/favorites), persisted via Supabase.
6. **Components**: Built reusable components like MovieCard (with hover effects), Header (with search), and pages.
7. **Integrations**: Set up Supabase client for auth and DB; TMDB service for movie data.
8. **Enhancements**: Added debouncing for search, toasts for feedback, responsive breakpoints, and theme support.
9. **Testing & Optimization**: Used Vite's dev tools for performance; linted code; ensured accessibility (ARIA labels in UI components).
10. **Deployment Prep**: Configured meta tags, favicon, and production build optimizations.

The focus was on modularity – each page/service is self-contained, with TypeScript ensuring type-safe API responses.

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add some amazing feature'`).
4. Push to branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Please ensure code follows ESLint rules and includes tests if adding features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Built by [Your Name] – feel free to reach out for questions or collaborations!

---

*Last updated: [Current Date]*
