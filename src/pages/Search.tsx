import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Header } from '@/components/layout/Header';
import { tmdbApi } from '@/services/tmdbApi';
import { Movie } from '@/types/movie';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  
  const debouncedQuery = useDebounce(query, 500);

  const searchMovies = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setTotalResults(0);
      return;
    }

    setIsLoading(true);
    try {
      const response = await tmdbApi.searchMovies(searchQuery);
      setMovies(response.results);
      setTotalResults(response.total_results);
    } catch (error) {
      console.error('Error searching movies:', error);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      searchMovies(debouncedQuery);
      setSearchParams({ q: debouncedQuery });
    } else {
      setMovies([]);
      setTotalResults(0);
      setSearchParams({});
    }
  }, [debouncedQuery, setSearchParams]);

  // Initial search on component mount
  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      searchMovies(initialQuery);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchMovies(query.trim());
      setSearchParams({ q: query.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cinema">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-glow">
            Discover Movies
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Search through thousands of movies to find your next favorite
          </p>
          
          {/* Enhanced Search Bar */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for movies by title..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-24 py-4 text-lg bg-card border-border/50 focus:border-primary rounded-full"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Results */}
        {query && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Searching...
                </span>
              ) : (
                `Search results for "${query}"`
              )}
            </h2>
            {totalResults > 0 && (
              <p className="text-muted-foreground mt-2">
                Found {totalResults.toLocaleString()} movies
              </p>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* Movies Grid */}
        {!isLoading && movies.length > 0 && (
          <MovieGrid movies={movies} />
        )}

        {/* No Results */}
        {!isLoading && query && movies.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🎬</div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">No movies found</h3>
            <p className="text-muted-foreground mb-8">
              We couldn't find any movies matching "{query}". Try a different search term.
            </p>
            <Button onClick={() => setQuery('')}>
              Clear Search
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-16">
            <div className="text-8xl mb-8 animate-float">🔍</div>
            <h3 className="text-3xl font-semibold text-foreground mb-4">Start Your Movie Discovery</h3>
            <p className="text-xl text-muted-foreground">
              Use the search bar above to find movies by title, actor, or director
            </p>
          </div>
        )}
      </main>
    </div>
  );
}