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
exports.checkPermission = void 0;
const userRepo = __importStar(require("../db/repos/user.repo"));
const errors_1 = require("../errors/errors");
const checkPermission = (required) => {
    const requiredPermissions = Array.isArray(required) ? required : [required];
    return async (req, res, next) => {
        try {
            const { userId } = req.res?.locals.jwtPayload;
            if (!userId) {
                throw new errors_1.UnathorizedError('Unauthorized');
            }
            const user = await userRepo.getFullUserById(userId);
            if (!user) {
                throw new errors_1.UnathorizedError('Unauthorized');
            }
            const userPermissions = user.permissions ?? [];
            const hasPermission = requiredPermissions.some((perm) => userPermissions.includes(perm));
            if (!hasPermission) {
                throw new errors_1.ForbiddenError('You do not have permission for this action');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkPermission = checkPermission;
