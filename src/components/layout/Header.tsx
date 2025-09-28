import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Film, Heart, Bookmark, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMovieContext } from '@/contexts/MovieContext';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { watchlist, favorites } = useMovieContext();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-effect">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Film className="w-8 h-8 text-primary animate-glow" />
            <span className="text-2xl font-bold text-primary text-glow">Cinema</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border/50 focus:border-primary"
              />
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>

            <Button
              variant={isActive('/mood') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/mood">
                <Sparkles className="w-4 h-4 mr-2" />
                Mood
              </Link>
            </Button>

            <Button
              variant={isActive('/watchlist') ? 'default' : 'ghost'}
              size="sm"
              asChild
              className="relative"
            >
              <Link to="/watchlist">
                <Bookmark className="w-4 h-4 mr-2" />
                Watchlist
                {watchlist.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 text-xs bg-primary text-primary-foreground border-0 p-0 flex items-center justify-center">
                    {watchlist.length}
                  </Badge>
                )}
              </Link>
            </Button>

            <Button
              variant={isActive('/favorites') ? 'default' : 'ghost'}
              size="sm"
              asChild
              className="relative"
            >
              <Link to="/favorites">
                <Heart className="w-4 h-4 mr-2" />
                Favorites
                {favorites.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 text-xs bg-destructive text-destructive-foreground border-0 p-0 flex items-center justify-center">
                    {favorites.length}
                  </Badge>
                )}
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}