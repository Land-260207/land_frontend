import type { landType } from "./land.type"
import type { userType } from "./user.type"

export type favoriteType = {
  user_id: number,
  User?: userType,
  sig_cd: string,
  Land?: landType
}