"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const Post_1 = require("./entities/Post");
const mikro_orm_config_1 = __importDefault(require("./entities/mikro-orm.config"));
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    const emFork = orm.em.fork();
    const post = emFork.create(Post_1.Post, { title: 'My first post' });
    await emFork.persistAndFlush(post);
};
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map