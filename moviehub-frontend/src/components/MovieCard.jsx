function MovieCard({ movie }) {

    return (
        <div
            style={{
                border: "1px solid gray",
                padding: "20px",
                margin: "20px",
                borderRadius: "10px",
                width: "300px"
            }}
        >
            <h2>{movie.title}</h2>

            <p>
                Genre: {movie.genre}
            </p>

            <p>
                Language: {movie.language}
            </p>

            <p>
                Duration: {movie.duration} mins
            </p>

            <button>
                View Details
            </button>

        </div>
    );
}

export default MovieCard;