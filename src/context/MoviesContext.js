import { createContext, useContext, useEffect, useReducer } from "react";
import { useLocalStorageState } from "../customHooks/useLocalStorageState";

const MoviesContext = createContext();

const initialState = {
  movies: [],
  movie: {},
  watched: [],
  isLoading: false,
  error: "",
  query: "",
  selectedID: null,
  userRating: 0,
};

const KEY = "33c39069";

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, movies: action.payload, isLoading: false };
    case "recieved_SelectedMovie":
      return { ...state, movie: action.payload, isLoading: false };
    case "fetchingData":
      return { ...state, isLoading: true };
    case "input_OnChange":
      return { ...state, query: action.payload };
    case "error":
      return { ...state, error: action.payload };

    case "selectMovie":
      return { ...state, selectedID: action.payload, userRating: 0 };
    case "handleUserRating":
      return { ...state, userRating: action.payload };

    default:
      return { ...state };
  }
}

function MovieProvider({ children }) {
  const [
    { movies, movie, watched, isLoading, query, error, selectedID, userRating },
    dispatch,
  ] = useReducer(reducer, initialState);

  //   Recieve data when input changes
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchData() {
      dispatch({ type: "fetchingData" });
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
          { signal }
        );

        if (!res.ok) throw new Error("There is some problem to fetch data");
        const data = await res.json();

        dispatch({ type: "dataRecieved", payload: data.Search || [] });
      } catch (err) {
        dispatch({ type: "error", payload: err });
      }
    }

    fetchData();
  }, [query]);

  /**************** 
   FUNCTIONS
   *****************/
  function handleInputChange(e) {
    dispatch({ type: "input_OnChange", payload: e.target.value });
  }

  function handleSelectMovie(id) {
    dispatch({ type: "selectMovie", payload: id });
  }

  function handleUserRating(rating) {
    dispatch({ type: "handleUserRating", payload: rating });
  }

  return (
    <MoviesContext.Provider
      value={{
        movies,
        movie,
        watched,
        isLoading,
        error,
        query,
        dispatch,
        handleInputChange,
        handleSelectMovie,
        selectedID,
        userRating,
        handleUserRating,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
}

function useMovieContext() {
  const context = useContext(MoviesContext);

  if (!context) throw new Error("error in context");

  return context;
}

export { MovieProvider, useMovieContext };
