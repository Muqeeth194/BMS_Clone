import { createSlice } from "@reduxjs/toolkit";

const loadersSlice = createSlice({
    name: 'loaders',
    initialState: {
        loading: false
    },
    reducers: {
        Showloading: (state) => {
            state.loading= true
        },
        HideLoading: (state) => {
            state.loading = false
        }
    }
})

export const {Showloading, HideLoading} = loadersSlice.actions
export default loadersSlice.reducer