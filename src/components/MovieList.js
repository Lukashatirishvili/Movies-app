import { useMovieContext } from "../context/MoviesContext";
import Movie from "./Movie";

export default function MovieList() {
  const { movies } = useMovieContext();
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
