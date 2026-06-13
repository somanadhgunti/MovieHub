import { useEffect, useState } from "react";
import { getAllMovies } from "../services/movieService";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";

function Home() {

    const [movies, setMovies] = useState([]);

    useEffect(() => {
        loadMovies();
    }, []);

    const loadMovies = async () => {

        try {

            const data = await getAllMovies();

            setMovies(data);

        } catch (error) {

            console.log(error);
        }
    };

    return (
        <div>

            <h1>MovieHub Movies</h1>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap"
                }}
            >
                {movies.map(movie => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                    />
                ))}
            </div>

        </div>
    );
}

export default Home;