"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("src/constants");
const Post_1 = require("./Post");
const config = {
    entities: [Post_1.Post],
    dbName: "reddit-clone",
    type: "postgresql",
    debug: !constants_1.__prod__,
};
exports.default = config;
//# sourceMappingURL=mikro-orm.config.js.map