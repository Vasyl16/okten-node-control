"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRefreshToken = exports.checkAccessToken = void 0;
const tokenRepo = __importStar(require("../db/repos/token.repo"));
const errors_1 = require("../errors/errors");
const token_service_1 = require("../services/token.service");
const checkAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new errors_1.UnathorizedError('Access tokes is not provide');
        }
        const accessToken = authHeader.split('Bearer ')[1];
        const payload = token_service_1.tokenService.verifyToken(accessToken, 'accessToken');
        const pairToken = await tokenRepo.findTokenPairByAccessToken(accessToken);
        if (!pairToken) {
            throw new errors_1.UnathorizedError('Token is invalid');
        }
        req.res.locals.jwtPayload = payload;
        req.res.locals.accessToken = accessToken;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkAccessToken = checkAccessToken;
const checkRefreshToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new errors_1.UnathorizedError('Access tokes is not provide');
        }
        const refreshToken = authHeader.split('Bearer ')[1];
        const payload = token_service_1.tokenService.verifyToken(refreshToken, 'refreshToken');
        const pairToken = await tokenRepo.findTokenPairByRefreshToken(refreshToken);
        if (!pairToken) {
            throw new errors_1.UnathorizedError('Token is invalid');
        }
        req.res.locals.jwtPayload = payload;
        req.res.locals.refreshToken = refreshToken;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkRefreshToken = checkRefreshToken;
