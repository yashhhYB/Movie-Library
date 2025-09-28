import { Movie } from '@/types/movie';
import { tmdbApi } from '@/services/tmdbApi';
import { useMovieContext } from '@/contexts/MovieContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Plus, Star, Eye, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInWatchlist,
    isInFavorites,
  } = useMovieContext();

  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isInFavorites(movie.id);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      toast({
        title: "Removed from watchlist",
        description: `${movie.title} has been removed from your watchlist.`,
      });
    } else {
      addToWatchlist(movie);
      toast({
        title: "Added to watchlist",
        description: `${movie.title} has been added to your watchlist.`,
      });
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inFavorites) {
      removeFromFavorites(movie.id);
      toast({
        title: "Removed from favorites",
        description: `${movie.title} has been removed from your favorites.`,
      });
    } else {
      addToFavorites(movie);
      toast({
        title: "Added to favorites",
        description: `${movie.title} has been added to your favorites.`,
      });
    }
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const formatRating = (rating: number) => {
    return (rating / 2).toFixed(1);
  };

  return (
    <Card 
      className="relative group cursor-pointer overflow-hidden bg-card border-border/50 poster-hover"
      onClick={handleCardClick}
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={tmdbApi.getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-gradient-poster opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <Button
              size="sm"
              variant={inWatchlist ? "secondary" : "default"}
              onClick={handleWatchlistToggle}
              className="w-full"
            >
              {inWatchlist ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleFavoriteToggle}
              className="w-full"
            >
              <Heart className={`w-4 h-4 mr-2 ${inFavorites ? 'fill-current text-red-500' : ''}`} />
              {inFavorites ? 'Favorited' : 'Add to Favorites'}
            </Button>
          </div>
        </div>

        {/* Rating Badge */}
        <Badge className="absolute top-2 right-2 bg-black/70 text-primary border-0">
          <Star className="w-3 h-3 mr-1 fill-current" />
          {formatRating(movie.vote_average)}
        </Badge>

        {/* View Details Button */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/movie/${movie.id}`);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {movie.overview || 'No overview available.'}
        </p>
      </div>
    </Card>
  );
}