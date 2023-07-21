import { Options } from '@mikro-orm/core';
import { __prod__ } from "src/constants";
import { Post } from "./Post";

// Why use Options? To satisfy Typescript
// https://stackoverflow.com/questions/66830617/i-want-to-init-mikroconfig-to-mikroorm-with-typescript-and-i-got-this-error-mess
const config: Options = {
    entities: [Post],
    dbName: "reddit-clone",
    type: "postgresql",
    debug : !__prod__,
};
export default config;