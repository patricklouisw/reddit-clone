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
// Redis
import RedisStore from "connect-redis"
import session from "express-session"
import {createClient} from "redis"
import { MyContext } from "./types";

// Augment express-session with a custom SessionData object
declare module "express-session" {
    interface SessionData {
      userId: number;
    }
  }

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
    // Apollo server didn't detect cookie solution: 
    // https://community.apollographql.com/t/allow-cookies-to-be-sent-alongside-request/920/17
    // app.set("trust proxy", __prod__);
    app.set("trust proxy", true);
    app.set("Access-Control-Allow-Origin", "https://studio.apollographql.com");
    app.set("Access-Control-Allow-Credentials", true);

    // Initialize Redis client.
    const redisClient = createClient()
    redisClient.connect().catch(console.error)

    // Initialize Redis store.
    const redisStore = new (RedisStore as any)({
        client: redisClient as any,
        disableTouch:true
        })

    // Initialize sesssion storage.
    app.use(
        session({
            name: 'qid',
            store: redisStore,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 year
                httpOnly: true,
                sameSite: "none",
                // secure: __prod__, 
                secure: true, // if true, studio works, postman doesn't; if false its the other way around
            },
            resave: false, // required: force lightweight session keep alive (touch)
            saveUninitialized: false, // recommended: only save session when data exists
            secret: "asdfasdfasdf",
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({req, res}): MyContext => ({em: emFork, req, res}) // Accessible by all resolvers
    })
    await apolloServer.start();

    const cors = { credentials: true, origin: 'https://studio.apollographql.com' }
    apolloServer.applyMiddleware({ app, cors }) 
    // apolloServer.applyMiddleware({app, }) // 4.

    app.listen(4000, ()=> {
        console.log("server started on localhost:4000");
    })
};

main().catch((err) => {
    console.error(err)
});