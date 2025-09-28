import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Movie } from '@/types/movie';

interface MovieState {
  watchlist: Movie[];
  favorites: Movie[];
  currentMovies: Movie[];
  isLoading: boolean;
  error: string | null;
}

type MovieAction =
  | { type: 'ADD_TO_WATCHLIST'; payload: Movie }
  | { type: 'REMOVE_FROM_WATCHLIST'; payload: number }
  | { type: 'ADD_TO_FAVORITES'; payload: Movie }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: number }
  | { type: 'SET_CURRENT_MOVIES'; payload: Movie[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_STORED_DATA'; payload: { watchlist: Movie[]; favorites: Movie[] } };

const initialState: MovieState = {
  watchlist: [],
  favorites: [],
  currentMovies: [],
  isLoading: false,
  error: null,
};

function movieReducer(state: MovieState, action: MovieAction): MovieState {
  switch (action.type) {
    case 'ADD_TO_WATCHLIST':
      const newWatchlist = [...state.watchlist, action.payload];
      localStorage.setItem('movie_watchlist', JSON.stringify(newWatchlist));
      return { ...state, watchlist: newWatchlist };

    case 'REMOVE_FROM_WATCHLIST':
      const filteredWatchlist = state.watchlist.filter(movie => movie.id !== action.payload);
      localStorage.setItem('movie_watchlist', JSON.stringify(filteredWatchlist));
      return { ...state, watchlist: filteredWatchlist };

    case 'ADD_TO_FAVORITES':
      const newFavorites = [...state.favorites, action.payload];
      localStorage.setItem('movie_favorites', JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };

    case 'REMOVE_FROM_FAVORITES':
      const filteredFavorites = state.favorites.filter(movie => movie.id !== action.payload);
      localStorage.setItem('movie_favorites', JSON.stringify(filteredFavorites));
      return { ...state, favorites: filteredFavorites };

    case 'SET_CURRENT_MOVIES':
      return { ...state, currentMovies: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'LOAD_STORED_DATA':
      return {
        ...state,
        watchlist: action.payload.watchlist,
        favorites: action.payload.favorites,
      };

    default:
      return state;
  }
}

interface MovieContextType extends MovieState {
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  setCurrentMovies: (movies: Movie[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isInWatchlist: (movieId: number) => boolean;
  isInFavorites: (movieId: number) => boolean;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedWatchlist = localStorage.getItem('movie_watchlist');
    const storedFavorites = localStorage.getItem('movie_favorites');

    const watchlist = storedWatchlist ? JSON.parse(storedWatchlist) : [];
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

    dispatch({
      type: 'LOAD_STORED_DATA',
      payload: { watchlist, favorites },
    });
  }, []);

  const addToWatchlist = (movie: Movie) => {
    if (!state.watchlist.find(m => m.id === movie.id)) {
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: movie });
    }
  };

  const removeFromWatchlist = (movieId: number) => {
    dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: movieId });
  };

  const addToFavorites = (movie: Movie) => {
    if (!state.favorites.find(m => m.id === movie.id)) {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: movie });
    }
  };

  const removeFromFavorites = (movieId: number) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: movieId });
  };

  const setCurrentMovies = (movies: Movie[]) => {
    dispatch({ type: 'SET_CURRENT_MOVIES', payload: movies });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const isInWatchlist = (movieId: number) => {
    return state.watchlist.some(movie => movie.id === movieId);
  };

  const isInFavorites = (movieId: number) => {
    return state.favorites.some(movie => movie.id === movieId);
  };

  const contextValue: MovieContextType = {
    ...state,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    setCurrentMovies,
    setLoading,
    setError,
    isInWatchlist,
    isInFavorites,
  };

  return (
    <MovieContext.Provider value={contextValue}>
      {children}
    </MovieContext.Provider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
}