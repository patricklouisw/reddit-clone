import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity() // Tells mikroORM that it coresponds to a database table
export class Post {

  @PrimaryKey()
  id!: number;

  @Property({type: "date"})
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({type: 'text'})
  title!: string;
}