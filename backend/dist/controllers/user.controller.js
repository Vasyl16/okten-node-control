"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unbanUser = exports.banUser = exports.updateCurrentUser = exports.getCurrentUser = exports.getUsers = void 0;
const user_service_1 = require("../services/user.service");
const getUsers = async (req, res, next) => {
    try {
        const users = await user_service_1.userService.listUsers();
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const getCurrentUser = async (req, res, next) => {
    try {
        const { userId } = req.res.locals.jwtPayload;
        const user = await user_service_1.userService.getCurrentUser(userId);
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.getCurrentUser = getCurrentUser;
const updateCurrentUser = async (req, res, next) => {
    try {
        const { userId } = req.res.locals.jwtPayload;
        const { firstName, lastName, phone } = req.body;
        const user = await user_service_1.userService.updateCurrentUser(userId, {
            firstName,
            lastName,
            phone,
        });
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateCurrentUser = updateCurrentUser;
const banUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId: callerUserId } = req.res.locals.jwtPayload;
        await user_service_1.userService.banUser(callerUserId, id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.banUser = banUser;
const unbanUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await user_service_1.userService.unbanUser(id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.unbanUser = unbanUser;
