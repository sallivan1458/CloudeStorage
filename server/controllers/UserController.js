import UserService from "../services/UserService.js";
import {validationResult} from "express-validator";
import ApiError from "../exeptions/api-error.js";

class UserController {

    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest("Validation Error", errors.array())
                );
            }

            const { email, password } = req.body;

            const userData = await UserService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 3 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });
            console.log('registration was successful', email)
            return res.status(201).json(userData);
        } catch (e){
            console.log('registration error:',e)
            next(e);
        }
    }


    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await UserService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 3 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });

            console.log('вход прошел успешно', email)
            return res.status(200).json(userData);
        } catch (e){
            console.log('login error:',e)
            next(e);
        }
    }


    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await UserService.logout(refreshToken);
            res.clearCookie('refreshToken');

            console.log('выход прошел успешно')
            return res.status(200).json(token);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }


    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 3 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });

            return res.status(200).json(userData);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }


    async getAllUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();

            return res.status(200).json(users);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

}

export default new UserController();