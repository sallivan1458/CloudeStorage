import $api from "../http";
import type IUserAuthResponse from "../models/responce/IUserAuthResponce.ts";
import type {AxiosResponse} from "axios";
import type IUser from "../models/IUser.ts";





export default class AuthService {
    static async login(email: string, password: string):Promise<AxiosResponse<IUserAuthResponse>> {
        return $api.post<IUserAuthResponse>('/login', {email, password})
    }


    static async registration(email: string, password: string):Promise<AxiosResponse<IUserAuthResponse>> {
        return $api.post<IUserAuthResponse>('/registration', { email, password })
    }


    static async logout():Promise<void> {
        return $api.post('/logout')
    }


    static async checkAuth():Promise<AxiosResponse<IUserAuthResponse>>{
        return $api.post<IUserAuthResponse>('/refresh')
    }


    static async getAllUsers():Promise<AxiosResponse<IUser[]>> {
        return $api.get('/getAllUsers')
    }
}