import { useMovieContext } from "../context/MoviesContext";

export default function Search() {
  const { handleInputChange, query, inputEl } = useMovieContext();

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={handleInputChange}
      ref={inputEl}
    />
  );
}
