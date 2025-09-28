import { Movie, MovieDetails, TMDBResponse, Genre } from '@/types/movie';

// TVMaze API - Free with no API key required
const TVMAZE_BASE_URL = 'https://api.tvmaze.com';

// OMDB API - Free tier (1000 requests/day)  
const OMDB_BASE_URL = 'https://www.omdbapi.com';
const OMDB_API_KEY = 'b9a5c5a4'; // Free public key

// Fallback image URLs
const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/500x750/1f2937/9ca3af?text=No+Image';

class FreeMovieApi {
  private tvmazeUrl = TVMAZE_BASE_URL;
  private omdbUrl = OMDB_BASE_URL;

  private async tvmazeRequest<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.tvmazeUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`TVMaze API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  private async omdbRequest<T>(params: Record<string, string>): Promise<T> {
    const url = new URL(this.omdbUrl);
    url.searchParams.append('apikey', OMDB_API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`OMDB API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  // Transform TVMaze show to Movie format
  private transformTVMazeShow(show: any): Movie {
    return {
      id: show.id,
      title: show.name,
      overview: show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'No overview available.',
      poster_path: show.image?.medium || '',
      backdrop_path: show.image?.original || '',
      release_date: show.premiered || '',
      vote_average: show.rating?.average ? show.rating.average : 0,
      vote_count: 0,
      genre_ids: show.genres ? show.genres.map((g: string, i: number) => i + 1) : [],
      adult: false,
      original_language: show.language || 'en',
      original_title: show.name,
      popularity: show.weight || 0,
      video: false,
    };
  }

  // Transform OMDB movie to Movie format
  private transformOMDBMovie(movie: any): Movie {
    return {
      id: parseInt(movie.imdbID.replace('tt', '')),
      title: movie.Title,
      overview: movie.Plot !== 'N/A' ? movie.Plot : 'No overview available.',
      poster_path: movie.Poster !== 'N/A' ? movie.Poster : '',
      backdrop_path: movie.Poster !== 'N/A' ? movie.Poster : '',
      release_date: movie.Year,
      vote_average: movie.imdbRating !== 'N/A' ? parseFloat(movie.imdbRating) : 0,
      vote_count: 0,
      genre_ids: movie.Genre ? movie.Genre.split(', ').map((_: string, i: number) => i + 1) : [],
      adult: false,
      original_language: 'en',
      original_title: movie.Title,
      popularity: 0,
      video: false,
    };
  }

  // Get popular shows (using TVMaze)
  async getPopularMovies(page = 1): Promise<TMDBResponse<Movie>> {
    try {
      const shows = await this.tvmazeRequest<any[]>('/shows');
      const movies = shows.slice((page - 1) * 20, page * 20).map(show => this.transformTVMazeShow(show));
      
      return {
        page,
        results: movies,
        total_pages: Math.ceil(shows.length / 20),
        total_results: shows.length,
      };
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return { page, results: [], total_pages: 0, total_results: 0 };
    }
  }

  // Get top rated shows
  async getTopRatedMovies(page = 1): Promise<TMDBResponse<Movie>> {
    try {
      const shows = await this.tvmazeRequest<any[]>('/shows');
      const sortedShows = shows
        .filter(show => show.rating?.average)
        .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
      
      const movies = sortedShows.slice((page - 1) * 20, page * 20).map(show => this.transformTVMazeShow(show));
      
      return {
        page,
        results: movies,
        total_pages: Math.ceil(sortedShows.length / 20),
        total_results: sortedShows.length,
      };
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      return { page, results: [], total_pages: 0, total_results: 0 };
    }
  }

  // Get now playing (recent shows)
  async getNowPlayingMovies(page = 1): Promise<TMDBResponse<Movie>> {
    try {
      const shows = await this.tvmazeRequest<any[]>('/shows');
      const recentShows = shows
        .filter(show => show.premiered)
        .sort((a, b) => new Date(b.premiered).getTime() - new Date(a.premiered).getTime());
      
      const movies = recentShows.slice((page - 1) * 20, page * 20).map(show => this.transformTVMazeShow(show));
      
      return {
        page,
        results: movies,
        total_pages: Math.ceil(recentShows.length / 20),
        total_results: recentShows.length,
      };
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      return { page, results: [], total_pages: 0, total_results: 0 };
    }
  }

  // Search movies (using both TVMaze and OMDB)
  async searchMovies(query: string, page = 1): Promise<TMDBResponse<Movie>> {
    try {
      // Try TVMaze first
      const tvmazeShows = await this.tvmazeRequest<any[]>(`/search/shows?q=${encodeURIComponent(query)}`);
      let movies = tvmazeShows.map(item => this.transformTVMazeShow(item.show));

      // If not enough results, try OMDB
      if (movies.length < 10) {
        try {
          const omdbResponse: any = await this.omdbRequest({
            s: query,
            page: page.toString(),
            type: 'movie'
          });
          
          if (omdbResponse.Response === 'True' && omdbResponse.Search) {
            const omdbMovies = omdbResponse.Search.map((movie: any) => this.transformOMDBMovie(movie));
            movies = [...movies, ...omdbMovies];
          }
        } catch (omdbError) {
          console.warn('OMDB search failed:', omdbError);
        }
      }

      return {
        page,
        results: movies.slice(0, 20),
        total_pages: Math.ceil(movies.length / 20),
        total_results: movies.length,
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      return { page, results: [], total_pages: 0, total_results: 0 };
    }
  }

  // Get movie details (try both APIs)
  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    try {
      // Try TVMaze first
      const show = await this.tvmazeRequest<any>(`/shows/${movieId}`);
      const baseMovie = this.transformTVMazeShow(show);
      
      return {
        ...baseMovie,
        genres: show.genres ? show.genres.map((name: string, id: number) => ({ id, name })) : [],
        runtime: show.runtime || 0,
        budget: 0,
        revenue: 0,
        production_companies: show.network ? [{ 
          id: 1, 
          name: show.network.name, 
          logo_path: null, 
          origin_country: show.network.country?.code || 'US' 
        }] : [],
        production_countries: show.network?.country ? [{ 
          iso_3166_1: show.network.country.code, 
          name: show.network.country.name 
        }] : [],
        spoken_languages: [{ iso_639_1: show.language || 'en', name: show.language || 'English' }],
        status: show.status || 'Unknown',
        tagline: show.summary ? show.summary.replace(/<[^>]*>/g, '').slice(0, 100) + '...' : '',
        homepage: show.officialSite || '',
        imdb_id: show.externals?.imdb || '',
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  // Get movies by genre
  async getMoviesByGenre(genreIds: number[], page = 1): Promise<TMDBResponse<Movie>> {
    try {
      const shows = await this.tvmazeRequest<any[]>('/shows');
      const genreNames = ['Drama', 'Comedy', 'Action', 'Thriller', 'Horror', 'Romance', 'Science-Fiction', 'Family'];
      const targetGenres = genreIds.map(id => genreNames[id - 1]).filter(Boolean);
      
      const filteredShows = shows.filter(show => 
        show.genres && show.genres.some((genre: string) => 
          targetGenres.some(targetGenre => 
            genre.toLowerCase().includes(targetGenre.toLowerCase())
          )
        )
      );
      
      const movies = filteredShows.slice((page - 1) * 20, page * 20).map(show => this.transformTVMazeShow(show));
      
      return {
        page,
        results: movies,
        total_pages: Math.ceil(filteredShows.length / 20),
        total_results: filteredShows.length,
      };
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return { page, results: [], total_pages: 0, total_results: 0 };
    }
  }

  // Get movie genres
  async getGenres(): Promise<{ genres: Genre[] }> {
    const genres: Genre[] = [
      { id: 1, name: 'Drama' },
      { id: 2, name: 'Comedy' },
      { id: 3, name: 'Action' },
      { id: 4, name: 'Thriller' },
      { id: 5, name: 'Horror' },
      { id: 6, name: 'Romance' },
      { id: 7, name: 'Science-Fiction' },
      { id: 8, name: 'Family' },
    ];
    
    return { genres };
  }

  // Get image URL (works with both TVMaze and external URLs)
  getImageUrl(path: string, size: 'w200' | 'w300' | 'w400' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return DEFAULT_IMAGE_URL;
    
    // If it's already a full URL (from TVMaze or OMDB), return it
    if (path.startsWith('http')) return path;
    
    // Otherwise, return placeholder
    return DEFAULT_IMAGE_URL;
  }

  // Get backdrop URL
  getBackdropUrl(path: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!path) return DEFAULT_IMAGE_URL;
    
    // If it's already a full URL, return it
    if (path.startsWith('http')) return path;
    
    // Otherwise, return placeholder
    return DEFAULT_IMAGE_URL;
  }
}

export const tmdbApi = new FreeMovieApi();