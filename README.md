# Learning on cloning Reddit


1. React

2. Typescript
- Library Install: `yarn add -D ts-node`

Setup:
- `yarn watch`: recompile typescript code everytime typescript code is changed
    - `package.json`: `tsc -w` is run to create a dist folder with prod code
        - `w`: is `watch` label that will auto re-compile to javascript prod code whenever files are saved.
- `yarn dev`: reexecute the javascript code that changes in the dist folder

3. GraphQL / Apollo Server
@Query is for getting data
@Mutation is for Inserting, Updating or mutating data
For practical sample: check resolvers/post.ts

4. URQL: Client-side GraphQL

5. Node.js

6. PostgreSQL
- Library Installed to connect mikroORM and postsql: `yarn add @mikro-orm/postgresql pg`
- Local installation of Postgresql `https://postgresapp.com/`

7. MikroORM/TypeORM
`MikroORM`: Help with interaction with database
- Library Install: `yarn add @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations`

Access to MikroORM CLI is based on mikro-orm.config.ts

The MikroORM flow:
    a. Connect to db
    b. Run Migrations
    c. Run Any other sql queries

Migration: migrate data and schema from MikroORM to database

8. Redis

9. Next.js

10. TypeGraphQL

11. Hashing of password is used with Argon2 instead of bcrypt
Reasoning: https://security.stackexchange.com/questions/193351/in-2018-what-is-the-recommended-hash-to-store-passwords-bcrypt-scrypt-argon2 



Express session:
- Store cookies (or data) on client's browser side for our server
- We choose to store the data in redis


How sessions work?
1. Storing some data to redis `req.session.userid = user.id`
    Redis is a key-value store (Sample: `sess:asdfasdfasdf -> {userId: 1}`)

2. Express-session will set a cookie on client's browser with a signed key `sess:asdfasdfasdf`
3. When User makes a request, `sess:asdfasdfasdf` is sent to the server where the server will look up redis store and get the value
4. on the server, it decrypt the cookie using the secret set before to get the value back from Redis