"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const express_1 = __importDefault(require("express"));
const config_1 = require("./configs/config");
const price_recalc_cron_1 = require("./cron/price-recalc.cron");
const errors_1 = require("./errors/errors");
const advert_router_1 = __importDefault(require("./router/advert.router"));
const auth_router_1 = __importDefault(require("./router/auth.router"));
const catalog_router_1 = __importDefault(require("./router/catalog.router"));
const moderation_router_1 = __importDefault(require("./router/moderation.router"));
const user_router_1 = __importDefault(require("./router/user.router"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/users', user_router_1.default);
app.use('/auth', auth_router_1.default);
app.use('/catalog', catalog_router_1.default);
app.use('/ads', advert_router_1.default);
app.use('/moderation', moderation_router_1.default);
app.use((err, req, res, _next) => {
    console.log(err);
    if (err instanceof errors_1.ValidationError) {
        res.status(err.status || 500).json({
            message: err.message,
            fields: err.fields,
        });
        return;
    }
    console.log(err);
    res.status(err?.status || 500).json({
        message: err.message,
    });
});
const appConfig = config_1.config.app;
(0, price_recalc_cron_1.startPriceRecalcCron)();
app.listen(appConfig.port, async () => {
    console.log(`Server running on http://${appConfig.host}:${appConfig.port}`);
});
