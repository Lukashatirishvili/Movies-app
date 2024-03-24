import { useMovieContext } from "../context/MoviesContext";

export default function NumResults() {
  const { movies } = useMovieContext();

  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}
