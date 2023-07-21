import "reflect-metadata"; // Required for graphql
import { __prod__ } from "./constants";
// MikroORM
import { MikroORM } from "@mikro-orm/core";
// import { Post } from './entities/Post'
import mikroOrmConfig from "./mikro-orm.config";
// Express
import express from 'express';
// GraphQL
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

/* 
== FLOW & EXPLANATION ==
1. Connect to db
2. Run Migrations
3. Run Express (App))
4. Run Apollo Server: Which connect us to Apollo studio to CRUD Graphql schema

Why fork?
- https://stackoverflow.com/questions/71117269/validation-error-using-global-entity-manager-instance-methods-for-context-speci
*/
const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig) // 1.
    const emFork = orm.em.fork();
    await orm.getMigrator().up(); // 2.

    const app = express(); // 3

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: () => ({em: emFork}) // Accessible by all resolvers
    })
    await apolloServer.start();
    apolloServer.applyMiddleware({app}) // 4.

    app.listen(4000, ()=> {
        console.log("server started on localhost:4000");
    })
};

main().catch((err) => {
    console.error(err)
});