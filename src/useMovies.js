import { useState, useEffect } from "react";
const KEY = "cbf91a52";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    callback?.();
    const controller = new AbortController();
    async function fetchData() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();
        if (data.Response === "False") throw new Error("No Movie Found");
        setMovies(data.Search);
        setError("");
        // console.log(data.Search);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    fetchData();
    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
