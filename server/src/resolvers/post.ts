// GraphQL Query
import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";

@Resolver()
export class PostResolver {
    // READING
    @Query(() => [Post]) 
    posts(@Ctx() {em}: MyContext): Promise<Post[]> // GraphQL_typecheck Typescript_Typecheck
    {
        return em.find(Post, {})
    }

    // READ ONE
    @Query(() => Post, { nullable: true})
    post(
        @Arg('id') id: number,
        @Ctx() {em}: MyContext,
    ): Promise<Post | null>
    {
        return em.findOne(Post, { id })
    }

    // POST ONE
    @Mutation(() => Post)
    async createPost(
        @Arg('title') title: string,
        @Ctx() {em}: MyContext,
    ): Promise<Post>
    {
        const post = em.create(Post, {
            title,
            createdAt: "",
            updatedAt: ""
        })
        await em.persistAndFlush(post)
        return post
        
    }

    // POST ONE
    @Mutation(() => Post, {nullable:true})
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, {nullable: true}) title: string,
        @Ctx() {em}: MyContext,
    ): Promise<Post | null>
    {
        const post = await em.findOne(Post, {id})
        if (!post) {
            return null
        }
        if (typeof title !== 'undefined'){
            post.title = title
            await em.persistAndFlush(post)
        }
        
        return post
    }

    // DELETE ONE
    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number,
        @Ctx() {em}: MyContext,
    ): Promise<Boolean>
    {
        try{
            await em.nativeDelete(Post, {id})
            return true
        } catch {
            return false
        }
    }

} 