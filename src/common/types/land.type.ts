import type Decimal from "decimal.js"
import type { dealType } from "./deal.type"
import type { favoriteType } from "./favorite.type"
import type { userType } from "./user.type"

export type landType = {
  sig_cd: string,
  name: string,
  full_name: string,
  price: bigint,
  owner_id?: number | null,
  Owner?: userType,
  price_change_rate: Decimal,
  Deals?: dealType[],
  Favorites?: favoriteType[]
}