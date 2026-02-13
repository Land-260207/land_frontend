import type { landType } from "./land.type"
import type { userType } from "./user.type"

export type dealType = {
  id: number,
  buyer_id: number,
  Buyer?: userType,
  owner_id: number,
  Owner?: userType,
  sig_cd: string,
  Land?: landType
  price: bigint,
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED',
  created_at: Date
}