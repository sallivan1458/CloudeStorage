import {configureStore} from "@reduxjs/toolkit";
import userAuthReducer from "../store/UserAuthSlice"

export const store = configureStore({
    reducer: {
        userAuthSlice: userAuthReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch