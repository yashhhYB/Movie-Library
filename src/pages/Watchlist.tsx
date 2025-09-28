import { MovieGrid } from '@/components/movie/MovieGrid';
import { Header } from '@/components/layout/Header';
import { useMovieContext } from '@/contexts/MovieContext';
import { Button } from '@/components/ui/button';
import { Bookmark, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Watchlist() {
  const { watchlist, removeFromWatchlist } = useMovieContext();

  const clearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      watchlist.forEach(movie => removeFromWatchlist(movie.id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cinema">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground text-glow mb-4">
              My Watchlist
            </h1>
            <p className="text-xl text-muted-foreground">
              {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} to watch
            </p>
          </div>
          
          {watchlist.length > 0 && (
            <Button
              variant="outline"
              onClick={clearWatchlist}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Movies Grid */}
        {watchlist.length > 0 ? (
          <MovieGrid movies={watchlist} />
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-8 animate-float">📚</div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Your watchlist is empty</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start adding movies you want to watch later
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/">
                  <Bookmark className="w-5 h-5 mr-2" />
                  Browse Movies
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/search">
                  Search Movies
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}