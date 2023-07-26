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
    // Me Query
    @Query(() => User, {nullable:true})
    async me(@Ctx() {req, em}: MyContext){
        // You are not logged in
        if(!req.session.userId){
            return null
        }

        const user = await em.findOne(User, {id: req.session.userId});
        return user
    }


    // Register User
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext,
    ): Promise<UserResponse>
    {
        const username = options.username;
        const password = options.password;
        if (username.length < 2){
            return {
                errors: [{
                    field: 'username',
                    message: "length must be greater than 2"
                }]
            }
        };

        if (password.length < 2){
            return {
                errors: [{
                    field: 'password',
                    message: "length must be greater than 2"
                }]
            }
        };

        const hashedPassword = await argon2.hash(password)
        const user = em.create(User, {
            username,
            password: hashedPassword,
            createdAt: "",
            updatedAt: ""
        })
        try{
            await em.persistAndFlush(user)
        } catch (err) {
            // Check for duplicate username
            if (err.code === "23505") {
                return {
                    errors:[{
                        field: "username",
                        message: "username already taken"
                    }]
                }
            }
        }

        // Store user id session
        req.session!.userId = user.id;
        
        return {user}
    }

    // Login
    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext,
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

        // Store user id session
        req.session!.userId = user.id;

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