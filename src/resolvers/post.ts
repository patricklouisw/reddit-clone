// GraphQL Query
import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Resolver, Query, Ctx } from "type-graphql";

@Resolver()
export class PostResolver {
    @Query(() => [Post]) // GraphQL typecheck
    posts(@Ctx() {em}: MyContext): Promise<Post[]> // Typescript Typecheck
    {
        return em.find(Post, {})
    }
} 