import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import useKey from "../customHooks/useKey";

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
    case "getItemsFrom_localStorage":
      return { ...state, watched: action.payload };
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
    case "addToList":
      return {
        ...state,
        watched: [...state.watched, action.payload],
        selectedID: null,
        query: "",
      };
    case "closeSelectedMovie":
      return { ...state, selectedID: null };
    case "handleDeleteMovie":
      return { ...state, watched: action.payload };
    case "keydown_Enter":
      return { ...state, query: "", selectedID: null };
    case "keydown_Escape":
      return { ...state, selectedID: null };
    default:
      return { ...state };
  }
}

function MovieProvider({ children }) {
  const [
    { movies, movie, watched, isLoading, query, error, selectedID, userRating },
    dispatch,
  ] = useReducer(reducer, initialState);

  const inputEl = useRef(null);

  // Side effects
  useKey("keydown", "enter", () => {
    if (document.activeElement === inputEl.current) return;
    console.log(document.activeElement);
    inputEl.current.focus();
    dispatch({ type: "keydown_Enter" });
  });

  useKey("keydown", "escape", () => {
    if (!selectedID) return;

    dispatch({ type: "keydown_Escape" });
  });
  // get watched movies from localstorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("watched"));
    if (data) dispatch({ type: "getItemsFrom_localStorage", payload: data });
  }, []);

  // set watched movies to localStorage
  useEffect(() => {
    if (watched.length < 1) return;
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

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

  function handleAddToList() {
    const obj = { ...movie, userRating };
    dispatch({ type: "addToList", payload: obj });
  }

  function closeSelectedMovie() {
    dispatch({ type: "closeSelectedMovie" });
  }

  function handleDeleteMovie(id) {
    const newMovies = watched.filter((movie) => movie.imdbID !== id);
    dispatch({ type: "handleDeleteMovie", payload: newMovies });
  }

  // Modify application's title
  useEffect(() => {
    selectedID
      ? (document.title = movie.Title)
      : (document.title = "usePopcorn");
  }, [selectedID, movie.Title]);

  // save watched movie in localStorage

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
        handleAddToList,
        closeSelectedMovie,
        handleDeleteMovie,
        inputEl,
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
