const { axiosInstance } = require(".")

export const AddMovie = async(payload) => {
    try {
        const response = await axiosInstance.post('/api/movies/add', payload)
        return response.data
    } catch (error) {
        return error
    }
}

export const GetAllMovies = async() => {
    try {
        const response = await axiosInstance.get('/api/movies/getAllMovies')
        return response.data
    } catch (error) {
        return error
    }
}

export const GetMovieById = async(movieId) => {
    try {
        const response = await axiosInstance.get(`/api/movies/getMovieById/${movieId}`)
        return response.data
    } catch (error) {
        return error
    }
}

export const DeleteMovie = async(payload) => {
    try {
        const response = await axiosInstance.post('/api/movies/delete', payload)
        return response.data
    } catch (error) {
        return error
    }
}

export const UpdateMovie = async(payload) => {
    try {
        const response = await axiosInstance.put('/api/movies/update', payload)
        return response.data
    } catch (error) {
        return error
    }
}