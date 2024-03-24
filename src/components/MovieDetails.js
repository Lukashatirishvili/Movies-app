import { useEffect } from "react";
import Loader from "./Loader";
import StarRating from "./StarRating";
import { useMovieContext } from "../context/MoviesContext";

const KEY = "33c39069";

export default function MovieDetails() {
  const {
    movie,
    watched,
    selectedID,
    isLoading,
    userRating,
    dispatch,
    handleAddToList,
    closeSelectedMovie,
  } = useMovieContext();

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);

  useEffect(() => {
    async function getSelectedMovie() {
      dispatch({ type: "fetchingData" });
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
        );

        if (!res.ok) throw new Error("There is some problem to fetch data");
        const data = await res.json();

        dispatch({
          type: "recieved_SelectedMovie",
          payload: data || [],
        });
      } catch (err) {
        dispatch({ type: "error", payload: err });
      }
    }
    getSelectedMovie();
  }, [selectedID, dispatch]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button onClick={closeSelectedMovie} className="btn-back">
              &larr;
            </button>
            <img src={movie.Poster} alt={`poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐</span>
                {movie.imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {isWatched ? (
                <p>You already rated this movie</p>
              ) : (
                <>
                  <StarRating />
                  {userRating > 0 && (
                    <>
                      <button
                        onClick={() => {
                          handleAddToList();
                        }}
                        className="btn-add"
                      >
                        + Add to list
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
