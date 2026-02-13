import type { dealType } from "./deal.type"
import type { favoriteType } from "./favorite.type"
import type { landType } from "./land.type"

export type userType = {
  id: number,
  username: string,
  balance: bigint,
  created_at: Date,
  Lands?: landType[],
  BuyerDeals?: dealType[],
  OwnerDeals?: dealType[],
  Favorites?: favoriteType[]
}