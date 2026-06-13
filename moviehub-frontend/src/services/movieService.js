import api from "./api";

export const getAllMovies = async () => {

    const token = localStorage.getItem("token");

    const response = await api.get(
        "/movies",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};