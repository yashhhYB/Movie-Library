import { useEffect, useState } from 'react';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Header } from '@/components/layout/Header';
import { useMovieContext } from '@/contexts/MovieContext';
import { tmdbApi } from '@/services/tmdbApi';
import { Movie } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Star, Clock, Film } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [activeCategory, setActiveCategory] = useState<'popular' | 'top_rated' | 'now_playing'>('popular');
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const { setLoading, setError, isLoading, error } = useMovieContext();

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [popularResponse, topRatedResponse, nowPlayingResponse] = await Promise.all([
        tmdbApi.getPopularMovies(),
        tmdbApi.getTopRatedMovies(),
        tmdbApi.getNowPlayingMovies(),
      ]);

      setPopularMovies(popularResponse.results);
      setTopRatedMovies(topRatedResponse.results);
      setNowPlayingMovies(nowPlayingResponse.results);
      
      // Set the first popular movie as featured
      if (popularResponse.results.length > 0) {
        setFeaturedMovie(popularResponse.results[0]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Please try again.');
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const getCurrentMovies = () => {
    switch (activeCategory) {
      case 'popular':
        return popularMovies;
      case 'top_rated':
        return topRatedMovies;
      case 'now_playing':
        return nowPlayingMovies;
      default:
        return popularMovies;
    }
  };

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'popular':
        return 'Popular Movies';
      case 'top_rated':
        return 'Top Rated Movies';
      case 'now_playing':
        return 'Now Playing';
      default:
        return 'Popular Movies';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-cinema">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Button onClick={fetchMovies}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-cinema">
      <Header />
      
      {/* Hero Section */}
      {featuredMovie && (
        <section className="relative h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${tmdbApi.getBackdropUrl(featuredMovie.backdrop_path, 'original')})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-primary text-primary-foreground">
                <Film className="w-3 h-3 mr-1" />
                Featured Movie
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-glow animate-slide-up">
                {featuredMovie.title}
              </h1>
              <p className="text-xl text-gray-200 mb-6 line-clamp-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {featuredMovie.overview}
              </p>
              <div className="flex items-center gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Badge variant="outline" className="border-primary text-primary">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {(featuredMovie.vote_average / 2).toFixed(1)}
                </Badge>
                <Badge variant="outline" className="border-white text-white">
                  {featuredMovie.release_date ? new Date(featuredMovie.release_date).getFullYear() : 'TBA'}
                </Badge>
              </div>
              <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <Button size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground">
                  <Film className="w-5 h-5 mr-2" />
                  View Details
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="container mx-auto px-4 py-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            variant={activeCategory === 'popular' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('popular')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Popular
          </Button>
          <Button
            variant={activeCategory === 'top_rated' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('top_rated')}
            className="flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Top Rated
          </Button>
          <Button
            variant={activeCategory === 'now_playing' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('now_playing')}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Now Playing
          </Button>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <MovieGrid
            movies={getCurrentMovies()}
            title={getCategoryTitle()}
          />
        )}
      </main>
    </div>
  );
}