import axios from 'axios';
import type IUserAuthResponse from "../models/responce/IUserAuthResponce.ts";



export const API_URL="http://localhost:5002/api";


const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})
// INTERCEPTOR

$api.interceptors.request.use((config) => {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

$api.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status == 401 && error.config && !error.config._isRetryRequest) {
        (originalRequest as any)._isRetryRequest = true
        try {
            const response = await axios.get<IUserAuthResponse>(
                `${API_URL}/refresh`,
                {withCredentials: true}
            )
            localStorage.setItem('token', response.data.accessToken)
            console.log('again get accessToken....')
            return $api.request(originalRequest)
        } catch (error) {
            console.log('не авторизован')
        }
    }

    throw error
})

export default $api;