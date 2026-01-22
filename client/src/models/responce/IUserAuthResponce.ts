import type IUser from "../IUser";

export default interface IUserAuthResponse {
    accessToken: string;
    refreshToken: string;
    user:IUser
}