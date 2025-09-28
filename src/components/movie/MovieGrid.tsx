import { Movie } from '@/types/movie';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  className?: string;
}

export function MovieGrid({ movies, title, className = "" }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <h2 className="text-2xl font-bold text-muted-foreground mb-4">No movies found</h2>
        <p className="text-muted-foreground">Try adjusting your search criteria or browse popular movies.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <h2 className="text-3xl font-bold text-foreground mb-8 text-glow">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}