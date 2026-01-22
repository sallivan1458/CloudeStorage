import User from "../models/User.js";
import bcrypt from "bcryptjs";
import UserDto from "../dtos/UserDto.js";
import ApiError from "../exeptions/api-error.js";
import TokenService from "./TokenService.js";

class UserService {

    async registration(email, password) {

        const candidate = await User.findOne({ email: email });
        if (candidate) {
            throw ApiError.BadRequest(`User with email ${email} already exists`);
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({
            email,
            password: hashPassword
        });

        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto});
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }


    async login(email, password) {

        const user = await User.findOne({ email: email });
        if (!user) {
            throw ApiError.NotFound(`User with email ${email} not found`);
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            throw ApiError.BadRequest(`Passwords do not match`);
        }

        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto});
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }


    async logout(refreshToken) {
        if (!refreshToken){
            throw ApiError.Unauthorized()
        }
        const token = await TokenService.removeToken(refreshToken)
        return token
    }


    async refresh(refreshToken) {
        if (!refreshToken){
            throw ApiError.Unauthorized()
        }
        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await TokenService.findToken(refreshToken)
        if (!userData || !tokenFromDB){
            throw ApiError.Unauthorized()
        }

        const user = await User.findById(userData.id)
        if (!user) {
            throw ApiError.Unauthorized("Пользователь не найден во время обновления токена");
        }
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto});
        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }


    async getAllUsers(){

        const users = await User.find()
        const usersDtos = users.map(user => new UserDto(user))

        return usersDtos
    }
}

export default new UserService();