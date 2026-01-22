import {Router} from "express";
import UserController from "../controllers/UserController.js";
import {body} from "express-validator";
import AuthMiddleware from "../middlewares/auth-middleware.js";

const router = new Router()

router.post('/registration',
    body("email")
        .isEmail()
        .withMessage("Email must be a valid email address"),
    body("password")
        .isLength({ min: 4, max: 32 })
        .withMessage("Password must be between 4 and 32 characters"),
    UserController.registration
)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.get('/refresh', UserController.refresh)
router.get('/getAllUsers',
    AuthMiddleware,
    UserController.getAllUsers
)


export default router;