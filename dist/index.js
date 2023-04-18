"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const next_1 = __importDefault(require("next"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
require('dotenv').config();
const port = parseInt(process.env.PORT || '8081', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next_1.default({ dev: process.env.NODE_ENV !== 'production' });
const handler = routes_1.default.getRequestHandler(app, ({ req, res, route, query }) => {
    if (route.name === 'model') {
        // eslint-disable-next-line no-param-reassign
        route.page = '/model/profile';
    }
    app.render(req, res, route.page, query);
});
app.prepare().then(() => {
    const expressApp = express_1.default();
    expressApp.use('/static', express_1.default.static('../static'));
    expressApp.use(handler).listen(port);
    // eslint-disable-next-line no-console
    console.log(`> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`);
})
    .catch((e) => {
    // eslint-disable-next-line no-console
    console.log('Something went wrong: ', e);
    process.exit();
});
