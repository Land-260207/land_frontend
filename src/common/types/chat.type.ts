export type chatType = {
  id: number,
  user_id: number,
  User?: {
    username: string
  },
  message: string,
  created_at: Date
}