import { useRef } from "react";
import { useKey } from "../customHooks/useKey";
import { useMovieContext } from "../context/MoviesContext";

export default function Search() {
  const inputEl = useRef(null);

  const { handleInputChange, query } = useMovieContext();

  useKey("Enter", () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
  });

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
