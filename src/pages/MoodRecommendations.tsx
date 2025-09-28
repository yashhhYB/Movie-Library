import { useEffect, useState } from 'react';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Header } from '@/components/layout/Header';
import { useMovieContext } from '@/contexts/MovieContext';
import { tmdbApi } from '@/services/tmdbApi';
import { Movie, MoodFilter } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const moodFilters: MoodFilter[] = [
  {
    mood: 'action',
    genreIds: [28, 12], // Action, Adventure
    label: 'Action & Adventure',
    emoji: '💥',
  },
  {
    mood: 'comedy',
    genreIds: [35], // Comedy
    label: 'Comedy & Fun',
    emoji: '😂',
  },
  {
    mood: 'drama',
    genreIds: [18], // Drama
    label: 'Drama & Emotion',
    emoji: '🎭',
  },
  {
    mood: 'horror',
    genreIds: [27], // Horror
    label: 'Horror & Thriller',
    emoji: '😱',
  },
  {
    mood: 'romance',
    genreIds: [10749], // Romance
    label: 'Romance & Love',
    emoji: '💕',
  },
  {
    mood: 'sci-fi',
    genreIds: [878, 14], // Science Fiction, Fantasy
    label: 'Sci-Fi & Fantasy',
    emoji: '🚀',
  },
  {
    mood: 'thriller',
    genreIds: [53, 80], // Thriller, Crime
    label: 'Thriller & Crime',
    emoji: '🔍',
  },
  {
    mood: 'family',
    genreIds: [10751, 16], // Family, Animation
    label: 'Family & Animation',
    emoji: '👨‍👩‍👧‍👦',
  },
];

export default function MoodRecommendations() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodFilter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setError } = useMovieContext();

  const fetchMoviesByMood = async (moodFilter: MoodFilter) => {
    setIsLoading(true);
    try {
      const response = await tmdbApi.getMoviesByGenre(moodFilter.genreIds);
      setMovies(response.results);
      setSelectedMood(moodFilter);
      toast.success(`Found ${response.results.length} ${moodFilter.label.toLowerCase()} movies!`);
    } catch (error) {
      console.error('Error fetching movies by mood:', error);
      setError('Failed to load movie recommendations');
      toast.error('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelect = (moodFilter: MoodFilter) => {
    fetchMoviesByMood(moodFilter);
  };

  const clearSelection = () => {
    setSelectedMood(null);
    setMovies([]);
  };

  return (
    <div className="min-h-screen bg-gradient-cinema">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-glow" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground text-glow">
              Mood-Based Recommendations
            </h1>
            <Sparkles className="w-8 h-8 text-primary animate-glow" />
          </div>
          <p className="text-xl text-muted-foreground">
            Tell us your mood and we'll recommend the perfect movies for you
          </p>
        </div>

        {/* Mood Selection */}
        {!selectedMood && (
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
              What's your mood today?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moodFilters.map((moodFilter) => (
                <Card
                  key={moodFilter.mood}
                  className="p-6 cursor-pointer hover:bg-card-hover transition-all duration-300 poster-hover border-border/50 group"
                  onClick={() => handleMoodSelect(moodFilter)}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {moodFilter.emoji}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {moodFilter.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Discover {moodFilter.label.toLowerCase()} movies
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Selected Mood Results */}
        {selectedMood && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{selectedMood.emoji}</div>
                <div>
                  <h2 className="text-3xl font-semibold text-foreground">
                    {selectedMood.label} Movies
                  </h2>
                  <p className="text-muted-foreground">
                    Perfect for your current mood
                  </p>
                </div>
              </div>
              <Button onClick={clearSelection} variant="outline">
                Choose Different Mood
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary mr-3" />
                <span className="text-xl text-foreground">Finding perfect movies for you...</span>
              </div>
            )}

            {/* Movies Grid */}
            {!isLoading && movies.length > 0 && (
              <MovieGrid movies={movies} />
            )}

            {/* No Results */}
            {!isLoading && movies.length === 0 && selectedMood && (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🎬</div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  No movies found for this mood
                </h3>
                <p className="text-muted-foreground mb-8">
                  Try selecting a different mood or check back later
                </p>
                <Button onClick={clearSelection}>
                  Choose Different Mood
                </Button>
              </div>
            )}
          </section>
        )}

        {/* Mood Description Cards */}
        {!selectedMood && (
          <section className="mt-16">
            <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
              How It Works
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center bg-card border-border/50">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Select Your Mood</h4>
                <p className="text-sm text-muted-foreground">
                  Choose from 8 different mood categories based on how you're feeling
                </p>
              </Card>
              <Card className="p-6 text-center bg-card border-border/50">
                <div className="text-4xl mb-4">🤖</div>
                <h4 className="text-lg font-semibold text-foreground mb-2">AI Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  Our algorithm finds movies that match your selected mood perfectly
                </p>
              </Card>
              <Card className="p-6 text-center bg-card border-border/50">
                <div className="text-4xl mb-4">🍿</div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Enjoy Watching</h4>
                <p className="text-sm text-muted-foreground">
                  Add movies to your watchlist and enjoy your personalized recommendations
                </p>
              </Card>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}