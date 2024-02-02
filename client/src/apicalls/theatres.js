const { axiosInstance } = require(".")

export const AddTheatre = async(payload) => {
    try {
        const response = await axiosInstance.post('/api/theatres/add', payload)
        return response.data
    } catch (error) {
        return error
    }
}

export const GetAllTheatresByOwner = async(userId) => {
    try {
        const response = await axiosInstance.get(`/api/theatres/getAllTheatresByOwner/${userId}`)
        return response.data
    } catch (error) {
        return error
    }
}

export const GetTheatresByMovie = async(payload) => {
    try {
        const response = await axiosInstance.post('/api/theatres/getTheatreByMovie/', payload)
        return response.data
    } catch (error) {
        return error
    }
}

export const GetAllTheatres = async() => {
    try {
        const response = await axiosInstance.get('/api/theatres/getAllTheatres')
        return response.data
    } catch (error) {
        return error 
    }
}

export const DeleteTheatre = async(payload) => {
    try {
        const response = await axiosInstance.post('/api/theatres/delete', payload)
        return response.data
    } catch (error) {
        return error
    }
}

export const UpdateTheatre = async(payload) => {
    try {
        const response = await axiosInstance.put('/api/theatres/update', payload)
        return response.data
    } catch (error) {
        return error
    }
}