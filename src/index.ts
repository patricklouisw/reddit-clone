import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from './entities/Post'
import mikroOrmConfig from "./entities/mikro-orm.config";


const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig)
    const emFork = orm.em.fork(); // https://stackoverflow.com/questions/71117269/validation-error-using-global-entity-manager-instance-methods-for-context-speci

    const post = emFork.create(Post, {title: 'My first post'} as Post);
    await emFork.persistAndFlush(post);
};

main().catch((err) => {
    console.error(err)
});