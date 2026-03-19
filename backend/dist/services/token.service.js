"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../configs/config");
const errors_1 = require("../errors/errors");
class TokenService {
    constructor() {
        this.generateToken = (payload) => {
            const accessToken = jsonwebtoken_1.default.sign(payload, config_1.config.token.accessToken, {
                expiresIn: config_1.config.token.accessTokenExp,
                algorithm: 'HS256',
            });
            const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.config.token.refreshToken, {
                expiresIn: config_1.config.token.refreshTokenExp,
                algorithm: 'HS256',
            });
            return { accessToken, refreshToken };
        };
        this.verifyToken = (token, type) => {
            let secret;
            if (type === 'accessToken') {
                secret = config_1.config.token.accessToken;
            }
            else {
                secret = config_1.config.token.refreshToken;
            }
            try {
                return jsonwebtoken_1.default.verify(token, secret);
            }
            catch (_) {
                throw new errors_1.UnathorizedError('Token is invalid');
            }
        };
    }
}
exports.tokenService = new TokenService();
