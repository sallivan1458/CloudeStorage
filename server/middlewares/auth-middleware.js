import ApiError from "../exeptions/api-error.js";
import TokenService from "../services/TokenService.js";


export default (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.Unauthorized());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.Unauthorized());
        }

        const userData = TokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.Unauthorized());
        }

        req.userData = userData;
        next();
    } catch (e) {
        return next(ApiError.Unauthorized());
    }
}