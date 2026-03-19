"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    async signUpUser(req, res, next) {
        try {
            const dto = req.body;
            const newUserData = await auth_service_1.authService.signUpUser(dto);
            res.status(201).send(newUserData);
        }
        catch (error) {
            next(error);
        }
    }
    async signInUser(req, res, next) {
        try {
            const dto = req.body;
            const userInfo = await auth_service_1.authService.singInUser(dto);
            res.status(201).send(userInfo);
        }
        catch (error) {
            next(error);
        }
    }
    async createManager(req, res, next) {
        try {
            const dto = req.body;
            const newUserData = await auth_service_1.authService.createManager(dto);
            res.status(201).send(newUserData);
        }
        catch (error) {
            next(error);
        }
    }
    async logOutUser(req, res, next) {
        try {
            const accessToken = req.res.locals.accessToken;
            await auth_service_1.authService.logOutUser(accessToken);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const tokenPaylod = req.res.locals.jwtPayload;
            const refreshToken = req.res.locals.refreshToken;
            const newTokenPair = await auth_service_1.authService.refresToken(tokenPaylod, refreshToken);
            res.status(201).send(newTokenPair);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.authController = new AuthController();
