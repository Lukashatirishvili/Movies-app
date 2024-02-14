import { useState, useEffect } from "react";

const KEY = "33c39069";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // callBack?.();

    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchMovies() {
      try {
        setError("");
        setIsLoading(true);

        const res = await fetch(
          `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
          { signal }
        );

        if (!res.ok) {
          throw new Error("Something went wrong with fetching movies");
        }

        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
      } catch (err) {
        console.log(err.message);

        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
    }
    // handleCloseMovie();
    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
