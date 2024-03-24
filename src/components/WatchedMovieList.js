import { useMovieContext } from "../context/MoviesContext";
import WatchedMovie from "./WatchedMovie";

export default function WatchedMovieList() {
  const { watched } = useMovieContext();
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
