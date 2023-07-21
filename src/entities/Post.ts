import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity() // Tells mikroORM that it coresponds to a database table
export class Post {

  @PrimaryKey()
  id!: number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  title!: string;
}