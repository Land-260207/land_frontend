import type Decimal from "decimal.js"
import type { landType } from "./land.type"

export type landPriceHistoryType = {
  id: number,
  sig_cd: string,
  Land?: landType,
  before_price: bigint,
  after_price: bigint,
  price_change: bigint,
  price_change_rate: Decimal,
  created_at: Date
}