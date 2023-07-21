// GraphQL Query
import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Mutation, ObjectType, InputType, Field } from "type-graphql";
import argon2 from "argon2"

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}

@ObjectType()
class FieldError {
    @Field()
    field: string
    @Field()
    message: string
}

@Resolver()
export class UserResolver {
    // Register User
    @Mutation(() => User)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em}: MyContext,
    ): Promise<User>
    {
        const username = options.username;
        const password = options.password;

        const hashedPassword = await argon2.hash(password)
        const user = em.create(User, {
            username,
            password: hashedPassword,
            createdAt: "",
            updatedAt: ""
        })
        await em.persistAndFlush(user)
        return user
    }

    // Login
    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em}: MyContext,
    ): Promise<UserResponse>
    {
        const username = options.username;
        const user = await em.findOne(User, {username});
        if (!user){
            return {
                errors:[{
                    field: "username",
                    message: "Username doesn't exist"
                }]
            }
        }

        const valid = await argon2.verify(user.password, options.password,)
        if (!valid){
            return {
                errors:[{
                    field: "password",
                    message: "Password is incorrect"
                }]
            }
        }

        return {user}
    }

    // READING
    @Query(() => [User]) 
    Users(@Ctx() {em}: MyContext): Promise<User[]> // GraphQL_typecheck Typescript_Typecheck
    {
        return em.find(User, {})
    }

    // READ ONE
    @Query(() => User, { nullable: true})
    User(
        @Arg('id') id: number,
        @Ctx() {em}: MyContext,
    ): Promise<User | null>
    {
        return em.findOne(User, { id })
    }

    // Update User ONE
    @Mutation(() => User, {nullable:true})
    async updateUser(
        @Arg('id') id: number,
        @Arg('username') username: string,
        @Arg('password') password: string,
        @Ctx() {em}: MyContext,
    ): Promise<User | null>
    {
        const user = await em.findOne(User, {id})
        if ( !user ) {
            return null
        }

        if (typeof username === 'undefined' && typeof username === 'undefined' ) {
            return user
        }

        if (typeof username !== 'undefined'){
            user.username = username
        }
        if (typeof password !== 'undefined'){
            const hashedPassword = await argon2.hash(password)
            user.password = hashedPassword
        }
        await em.persistAndFlush(user)
        
        return user
    }

    // DELETE ONE
    @Mutation(() => Boolean)
    async deleteUser(
        @Arg('id') id: number,
        @Ctx() {em}: MyContext,
    ): Promise<Boolean>
    {
        try{
            await em.nativeDelete(User, {id})
            return true
        } catch {
            return false
        }
    }

} 