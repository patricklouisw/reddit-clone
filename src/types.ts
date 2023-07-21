import { EntityManager, Connection, IDatabaseDriver } from "@mikro-orm/core"

type NewType = IDatabaseDriver<Connection>

export type MyContext = {
 em: EntityManager<any> & EntityManager<NewType>
}