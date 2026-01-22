import {createAsyncThunk, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type IUser from "../models/IUser";
import AuthService from "../services/UserAuthService.ts";
import axios from "axios";
import {API_URL} from "../http";
import {ApiError} from "../models/IErrors.ts";
import type IUserAuthResponse from "../models/responce/IUserAuthResponce.ts";



export const login = createAsyncThunk<
    IUser,
    { email: string; password: string },
    { rejectValue: ApiError }
>('users/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await AuthService.login(email, password);
        console.log('login',response)
        localStorage.setItem('token', response.data.accessToken)
        return response.data.user
    } catch (err) {
        console.log('rrr',err)
        if (axios.isAxiosError(err)) {
            return rejectWithValue(
                new ApiError({
                    status: err.response?.status || 500,
                    message: err.response?.data?.message || 'Network error',
                })
            );
        }
        return rejectWithValue(
            new ApiError({
                status: 500,
                message: 'Unknown error',
            })
        );
    }
});


export const registration = createAsyncThunk<
    IUser,
    {
        password: string,
        email: string},
    { rejectValue: ApiError }>(
    'users/registration',
    async ({ email, password}, { rejectWithValue }) => {
        try {
            const response = await AuthService.registration(email, password);
            console.log('registration',response)
            localStorage.setItem('token', response.data.accessToken)
            return response.data.user
        } catch (err) {
            console.log('reg error',err)
            if (axios.isAxiosError(err)) {
                return rejectWithValue(
                    new ApiError({
                        status: err.response?.status || 500,
                        message: err.response?.data?.message || 'Network error',
                    })
                );
            }
            return rejectWithValue(
                new ApiError({
                    status: 500,
                    message: 'Unknown error',
                })
            );
        }
    },
);


export const logout = createAsyncThunk<
    void,
    void,
    { rejectValue: ApiError }
>('users/logout', async (_,{rejectWithValue} ) => {
    try {
        const response = await AuthService.logout();
        console.log('logout',response)
        localStorage.removeItem('token')
        return
    } catch (err) {
        console.log('logout error',err)
        if (axios.isAxiosError(err)) {
            return rejectWithValue(
                new ApiError({
                    status: err.response?.status || 500,
                    message: err.response?.data?.message || 'Network error',
                })
            );
        }
        return rejectWithValue(
            new ApiError({
                status: 500,
                message: 'Unknown error',
            })
        );
    }
});


export const checkAuth = createAsyncThunk<
    IUser,
    void,
    { rejectValue: ApiError }
>('users/checkAuth', async (_,{rejectWithValue} ) => {
    try {
        const response = await axios.get<IUserAuthResponse>(
            `${API_URL}/refresh`,
            {withCredentials:true}
        );
        localStorage.setItem('token', response.data.accessToken)
        return response.data.user
    } catch (err) {
        console.log('checkAuth error',err)
        if (axios.isAxiosError(err)) {
            return rejectWithValue(
                new ApiError({
                    status: err.response?.status || 500,
                    message: err.response?.data?.message || 'checkAuth axios error',
                })
            );
        }
        return rejectWithValue(
            new ApiError({
                status: 500,
                message: 'Unknown error',
            })
        );
    }
});



export const getAllUsers = createAsyncThunk<
    IUser[],
    void,
    { rejectValue: ApiError }
>('users/getAllUsers', async (_,{rejectWithValue} ) => {
    try {
        const response = await AuthService.getAllUsers();
        console.log('getAllUsers',response.data)
        return response.data
    } catch (err) {
        console.log('getAllUsers error',err)
        if (axios.isAxiosError(err)) {
            return rejectWithValue(
                new ApiError({
                    status: err.response?.status || 500,
                    message: err.response?.data?.message || 'getAllUsers axios error',
                })
            );
        }
        return rejectWithValue(
            new ApiError({
                status: 500,
                message: 'Unknown error',
            })
        );
    }
});




export interface newUserAuthSlice {
    user:IUser | undefined,
    users:IUser[] | undefined,
    isAuth: boolean,
    errors: ApiError | null
    login: 'idle' | 'pending' | 'success' | 'failed' | 'notfound'
    registration: 'idle' | 'pending' | 'success' | 'failed'
    logout: 'idle' | 'pending' | 'success' | 'failed'
    checkAuth: 'idle' | 'pending' | 'success' | 'failed'
    getAllUsers: 'idle' | 'pending' | 'success' | 'failed'

}

const initialState: newUserAuthSlice = {
    user: undefined,
    users: undefined,
    isAuth: false,
    errors: null,
    registration: 'idle',
    login: 'idle',
    logout: 'idle',
    checkAuth: 'idle',
    getAllUsers: 'idle',
}

export const UserAuthSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        knockErrors:(state) => {
            state.errors = null
        },
        refreshTokenHasExpired:(state) => {
            state.isAuth = false;
            state.user = undefined
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.errors = null
                state.login = 'pending'
            })
            .addCase(login.fulfilled, (state, action:PayloadAction<IUser>) => {
                state.errors = null
                state.user = action.payload
                state.login = 'success'
                state.isAuth = true
            })
            .addCase(login.rejected, (state, action) => {
                if (action.payload?.status === 404){
                    state.login = 'notfound'
                } else {
                    state.login = 'failed'
                }
                state.isAuth = false
                state.errors = action.payload || new ApiError({ status: 500, message: 'Unknown any error' })
            })


            .addCase(registration.pending, (state) => {
                state.errors = null;
                state.registration = 'pending';
            })
            .addCase(registration.fulfilled, (state, action) => {
                state.errors = null;
                state.user = action.payload;
                state.registration = 'success';
                state.isAuth = true;
            })
            .addCase(registration.rejected, (state, action) => {
                state.errors = action.payload || new ApiError({ status: 500, message: 'Unknown error' });
                state.registration = 'failed';
                state.isAuth = false;
            })


            .addCase(logout.pending, (state) => {
                state.errors = null
                state.logout = 'pending'
            })
            .addCase(logout.fulfilled, (state) => {
                state.errors = null
                state.user = undefined
                state.logout = 'success'
                state.isAuth = false
                state.registration ='idle'
                state.login ='idle'
            })
            .addCase(logout.rejected, (state, action) => {
                state.errors = action.payload || new ApiError({ status: 500, message: 'Unknown any error' })
                state.logout = 'failed'
            })


            .addCase(checkAuth.pending, (state) => {
                console.log('checkAuth pending')
                state.errors = null
                state.checkAuth = 'pending'
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                console.log('checkAuth Fulfilled')
                state.errors = null
                state.user = action.payload
                state.checkAuth = 'success'
                state.isAuth = true
            })
            .addCase(checkAuth.rejected, (state, action) => {
                console.log('checkAuth rejected')
                state.errors = action.payload || new ApiError({ status: 500, message: 'Unknown any error' })
                state.user = undefined
                state.checkAuth = 'failed'
                state.isAuth = false
            })


            .addCase(getAllUsers.pending, (state) => {
                console.log('getAllUsers pending')
                state.errors = null
                state.getAllUsers = 'pending'
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                console.log('getAllUsers Fulfilled')
                state.errors = null
                state.users = action.payload
                state.getAllUsers = 'success'
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                console.log('getAllUsers rejected')
                state.errors = action.payload || new ApiError({ status: 500, message: 'Unknown any error' })
                state.getAllUsers = 'failed'
            })
    },
})



export default UserAuthSlice.reducer
export const {
    knockErrors,
    refreshTokenHasExpired
} =  UserAuthSlice.actions