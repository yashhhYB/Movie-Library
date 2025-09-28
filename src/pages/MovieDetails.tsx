import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { MovieDetails as MovieDetailsType } from '@/types/movie';
import { tmdbApi } from '@/services/tmdbApi';
import { useMovieContext } from '@/contexts/MovieContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Calendar, 
  DollarSign, 
  Globe, 
  Heart, 
  Bookmark,
  Check,
  Plus,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInWatchlist,
    isInFavorites,
  } = useMovieContext();

  const fetchMovieDetails = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const movieDetails = await tmdbApi.getMovieDetails(parseInt(id));
      setMovie(movieDetails);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Failed to load movie details');
      toast.error('Failed to load movie details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-cinema">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-card rounded mb-4 w-48"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="aspect-[2/3] bg-card rounded-lg"></div>
              <div className="md:col-span-2 space-y-4">
                <div className="h-12 bg-card rounded w-3/4"></div>
                <div className="h-4 bg-card rounded w-full"></div>
                <div className="h-4 bg-card rounded w-5/6"></div>
                <div className="h-4 bg-card rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-cinema">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Movie Not Found</h1>
          <p className="text-muted-foreground mb-8">{error || 'The movie you are looking for could not be found.'}</p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isInFavorites(movie.id);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      toast.success(`Removed ${movie.title} from watchlist`);
    } else {
      addToWatchlist(movie);
      toast.success(`Added ${movie.title} to watchlist`);
    }
  };

  const handleFavoriteToggle = () => {
    if (inFavorites) {
      removeFromFavorites(movie.id);
      toast.success(`Removed ${movie.title} from favorites`);
    } else {
      addToFavorites(movie);
      toast.success(`Added ${movie.title} to favorites`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-cinema">
      <Header />
      
      {/* Hero Section */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${tmdbApi.getBackdropUrl(movie.backdrop_path, 'original')})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 py-12">
          <Button variant="ghost" className="mb-6 text-white hover:text-primary" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Movies
            </Link>
          </Button>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Poster */}
            <div className="animate-slide-up">
              <img
                src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-full rounded-lg shadow-poster"
              />
            </div>

            {/* Movie Info */}
            <div className="md:col-span-2 space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-glow">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-xl text-gray-300 italic mb-4">"{movie.tagline}"</p>
                )}
              </div>

              {/* Badges and Stats */}
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {(movie.vote_average / 2).toFixed(1)}
                </Badge>
                <Badge variant="outline" className="border-white text-white">
                  <Calendar className="w-3 h-3 mr-1" />
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                </Badge>
                {movie.runtime && (
                  <Badge variant="outline" className="border-white text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatRuntime(movie.runtime)}
                  </Badge>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              {/* Overview */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-3">Overview</h3>
                <p className="text-lg text-gray-200 leading-relaxed">
                  {movie.overview || 'No overview available.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={handleWatchlistToggle}
                  variant={inWatchlist ? "secondary" : "default"}
                >
                  {inWatchlist ? <Check className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleFavoriteToggle}
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  <Heart className={`w-5 h-5 mr-2 ${inFavorites ? 'fill-current text-red-500' : ''}`} />
                  {inFavorites ? 'Favorited' : 'Add to Favorites'}
                </Button>
                {movie.homepage && (
                  <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-black">
                    <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Details */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Movie Stats */}
          <Card className="p-6 bg-card border-border/50">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Movie Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge>{movie.status}</Badge>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Original Language</span>
                <span className="font-medium text-foreground">
                  {movie.original_language.toUpperCase()}
                </span>
              </div>
              <hr className="border-border" />
              {movie.budget > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(movie.budget)}
                    </span>
                  </div>
                  <hr className="border-border" />
                </>
              )}
              {movie.revenue > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(movie.revenue)}
                    </span>
                  </div>
                  <hr className="border-border" />
                </>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Vote Count</span>
                <span className="font-medium text-foreground">
                  {movie.vote_count.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Production Info */}
          <Card className="p-6 bg-card border-border/50">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Production</h3>
            <div className="space-y-4">
              {movie.production_companies.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Companies</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.production_companies.map((company) => (
                      <Badge key={company.id} variant="outline">
                        {company.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {movie.production_countries.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Countries</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.production_countries.map((country) => (
                      <Badge key={country.iso_3166_1} variant="outline">
                        <Globe className="w-3 h-3 mr-1" />
                        {country.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {movie.spoken_languages.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.spoken_languages.map((language) => (
                      <Badge key={language.iso_639_1} variant="outline">
                        {language.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}