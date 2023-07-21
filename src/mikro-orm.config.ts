/* This file allow us to use MikroORM CLI commands */
import { Options } from '@mikro-orm/core';
import { __prod__ } from "./constants"
import { Post } from "./entities/Post";
import path from 'path';

// Why use Options? To satisfy Typescript
// https://stackoverflow.com/questions/66830617/i-want-to-init-mikroconfig-to-mikroorm-with-typescript-and-i-got-this-error-mess
const config: Options = {
    entities: [Post],
    migrations: {
        path: path.join(__dirname, "./migrations"),
        glob: '!(*.d).{js,ts}'
    },
    dbName: "reddit-clone",
    type: "postgresql",
    debug : !__prod__,
};
export default config;