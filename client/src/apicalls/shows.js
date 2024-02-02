const { axiosInstance } = require(".")

export const AddShow = async(payload) => {
    try {
        const response = await axiosInstance.post('/api/shows/add', payload)
        return response.data
    } catch (error) {
        return error
    }
}

export const GetAllShowsByTheatre = async(theatreId) => {
    try {
        const response = await axiosInstance.get(`/api/shows/getAllShowsByTheatre/${theatreId}`)
        return response.data
    } catch (error) {
        return error
    }
}

export const GetShowById = async(showId) => {
    try {
        const response = await axiosInstance.get(`/api/shows/getShowById/${showId}`)
        return response.data
    } catch (error) {
        return error
    }
}

export const DeleteShow = async(showId) => {
    try {
        const response = await axiosInstance.post('/api/shows/delete', showId)
        return response.data
    } catch (error) {
        return error
    }
}


// export const GetAllTheatres = async() => {
//     try {
//         const response = await axiosInstance.get('/api/theatres/getAllTheatres')
//         return response.data
//     } catch (error) {
//         return error 
//     }
// }


// export const UpdateTheatre = async(payload) => {
//     try {
//         const response = await axiosInstance.put('/api/theatres/update', payload)
//         return response.data
//     } catch (error) {
//         return error
//     }
// }