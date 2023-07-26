import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity() // Tells mikroORM that it coresponds to a database table
export class Post {
    @Field()
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({type: "date"})
    createdAt = new Date();

    @Field(() => String)
    @Property({ type: "date", onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field()
    @Property({type: 'text'})
    title!: string;
}