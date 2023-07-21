import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from './entities/Post'
import mikroOrmConfig from "./mikro-orm.config";


const main = async () => {
    // 1. Connect to db
    const orm = await MikroORM.init(mikroOrmConfig)
    // 2. Run Migrations
    await orm.getMigrator().up();

    /* 3. Run sql
    Why fork?
    https://stackoverflow.com/questions/71117269/validation-error-using-global-entity-manager-instance-methods-for-context-speci
    */
    const emFork = orm.em.fork();
    // const post = emFork.create(Post, {title: 'My first post'} as Post);
    // await emFork.persistAndFlush(post);
    // const posts = await emFork.find(Post, {})
    // console.log(posts)
};

main().catch((err) => {
    console.error(err)
});