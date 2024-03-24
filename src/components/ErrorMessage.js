import { useMovieContext } from "../context/MoviesContext";

export default function ErrorMessage() {
  const { error } = useMovieContext();
  return (
    <p className="error">
      <span>⛔</span> {error}
    </p>
  );
}
