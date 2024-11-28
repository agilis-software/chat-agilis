export interface Message {
  id: string
  content: string
  receiver: {
    id: string
    name: string
    birth_date: string
    avatar_url: string
  }
  sender: {
    id: string
    name: string
    birth_date: string
    avatar_url: string
  }
  created_at: string
}
