import { MovieGrid } from '@/components/movie/MovieGrid';
import { Header } from '@/components/layout/Header';
import { useMovieContext } from '@/contexts/MovieContext';
import { Button } from '@/components/ui/button';
import { Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { favorites, removeFromFavorites } = useMovieContext();

  const clearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all your favorites?')) {
      favorites.forEach(movie => removeFromFavorites(movie.id));
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
              My Favorites
            </h1>
            <p className="text-xl text-muted-foreground">
              {favorites.length} {favorites.length === 1 ? 'favorite movie' : 'favorite movies'}
            </p>
          </div>
          
          {favorites.length > 0 && (
            <Button
              variant="outline"
              onClick={clearFavorites}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Movies Grid */}
        {favorites.length > 0 ? (
          <MovieGrid movies={favorites} />
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-8 animate-float">❤️</div>
            <h2 className="text-3xl font-bold text-foreground mb-4">No favorites yet</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Mark movies as favorites to keep track of your all-time favorites
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/">
                  <Heart className="w-5 h-5 mr-2" />
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