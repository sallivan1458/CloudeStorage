import jwt from 'jsonwebtoken';
import Token from "../models/Token.js";
import ApiError from "../exeptions/api-error.js";

class TokenService {
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY,{
            expiresIn: '420s'
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY,{
            expiresIn: '1800s'
        });
        return {accessToken, refreshToken};
    }

    validateAccessToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
            console.log('validate access token');
            return userData;
        } catch (e){
            return null
        }
    }

    validateRefreshToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
            console.log('validate refresh token');
            return userData;
        } catch (e){
            return null
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await Token.findOne({user:userId})
        if (tokenData){
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        const token = await Token.create({user:userId, refreshToken:refreshToken})
        return token
    }

    async removeToken(refreshToken){
        const tokenData = await Token.deleteOne({refreshToken})
        if (!tokenData){
            throw ApiError.BadRequest('User not found')
        }
        return tokenData
    }

    async findToken(refreshToken){
        const tokenData = Token.findOne({refreshToken})
        return tokenData
    }
}


export default new TokenService();