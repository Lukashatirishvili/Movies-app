import { useLocalStorageState } from "./customHooks/useLocalStorageState";

// context
import { useMovieContext } from "./context/MoviesContext";

// Components
import NavBar from "./components/NavBar";
import Search from "./components/Search";
import NumResults from "./components/NumResults";
import Logo from "./components/Logo";
import Box from "./components/Box";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import MovieList from "./components/MovieList";
import WatchedSummary from "./components/WatchedSummary";
import WatchedMovieList from "./components/WatchedMovieList";
import MovieDetails from "./components/MovieDetails";
import Main from "./components/Main";

export default function App() {
  const [watched, setWatched] = useLocalStorageState([], "watched"); // Custom Hook

  const { isLoading, error, selectedID } = useMovieContext();

  // function handleCloseMovie() {
  //   setSelectedId(null);
  // }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDelete(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search />
        <NumResults />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList />}

          {error && <ErrorMessage />}
        </Box>

        <Box>
          {selectedID ? (
            <MovieDetails
            // onCloseMovie={handleCloseMovie}
            // selectedId={selectedId}
            // onAddWatched={handleAddWatched}
            // watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} onDelete={handleDelete} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
