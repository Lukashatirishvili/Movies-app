import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import StarRating from "./StarRating";
import { useMovieContext } from "../context/MoviesContext";

const KEY = "33c39069";

export default function MovieDetails() {
  const { movie, watched, selectedID, isLoading, userRating, dispatch } =
    useMovieContext();

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current = countRef.current + 1;
  }, [userRating]);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;

  useEffect(() => {
    async function getSelectedMovie() {
      dispatch({ type: "fetchingData" });
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
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

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back">&larr;</button>
            <img src={poster} alt={`poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              <StarRating />
              {userRating > 0 && (
                <>
                  <button className="btn-add">+ Add to list</button>
                </>
              )}
              {/* {!isWatched ? (
                <>
                  <StarRating maxRating={10} size={24} />
                  {
                  )}
                </>
              ) : (
                <p>
                  You rated with movie {watchedUserRating} <span>⭐</span>
                </p>
              )} */}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
