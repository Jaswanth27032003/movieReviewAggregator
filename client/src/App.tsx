import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ScrollProvider } from './context/ScrollContext';
import RootLayout from './components/Layout/RouteLayout';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import TVShowsPage from './pages/TVShowsPage';
import Watchlist from './pages/Watchlist';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TopRatedMoviesPage from './pages/TopRatedMovies';
import DetailsPage from './pages/sharedDetails';
import TopRatedTVShowsPage from './pages/TopRatedTvShows';

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: "movies",
          element: <MoviesPage />
        },
        {
          path: "tv",
          element: <TVShowsPage />
        },
        {
          path: "details/:mediaType/:id",
          element: <DetailsPage />
        },
        {
          path: "top-rated-tv",
          element: <TopRatedTVShowsPage />
        },
        {
          path: "top-rated",
          element: <TopRatedMoviesPage />
        },
        {
          path: "watchlist",
          element: <Watchlist />
        },
        {
          path: "search",
          element: <SearchPage />
        },
        {
          path: "login",
          element: <LoginPage />
        },
        {
          path: "register",
          element: <RegisterPage />
        },
        {
          path: "*",
          element: <div>Page not found</div>
        }
      ]
    }
  ]);

  return (
    <AuthProvider>
      <ThemeProvider>
        <ScrollProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </ScrollProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;