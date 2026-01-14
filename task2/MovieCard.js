function MovieCard({ movie, onFavorite }) {
  return (
    <div className="movie-card">
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"}
        alt={movie.Title}
      />
      <h4>{movie.Title}</h4>
      <p>{movie.Year}</p>

      {onFavorite && (
        <button onClick={() => onFavorite(movie)}>❤️ Add to Favorites</button>
      )}
    </div>
  );
}

export default MovieCard;
