import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import "./App.css";

const API_KEY = "1736265a";

function App() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [error, setError] = useState("");
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const searchMovies = async (movieName) => {
    if (!movieName.trim()) return;

    try {
      setError("");
      const response = await fetch(
        `https://www.omdbapi.com/?s=${movieName}&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  const addToFavorites = (movie) => {
    const alreadyAdded = favorites.some(
      (fav) => fav.imdbID === movie.imdbID
    );
    if (!alreadyAdded) {
      setFavorites([...favorites, movie]);
    }
  };

  return (
    <div>
      <h1 className="app-title">🎬 Movie Search App</h1>

      <SearchBar onSearch={searchMovies} />

      {error && <p className="error-text">{error}</p>}

      <h2 className="section-title">Search Results</h2>
      <div className="movie-container">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            onFavorite={addToFavorites}
          />
        ))}
      </div>

      {favorites.length > 0 && (
        <>
          <h2 className="section-title">❤️ Favorites</h2>
          <div className="movie-container">
            {favorites.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
