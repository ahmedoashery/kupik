import type { Avatar } from '#ui/types'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'

export interface User {
  id: number
  name: string
  email: string
  avatar?: Avatar
  status: UserStatus
  location: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: Avatar
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}


export interface Entity {
  id: number;
  avatar?: string|null;
  groupId?: number|null;
  group?: Group|null;
  code?: string|null;
  accountNumber?: string|null;
  firstname: string|null;
  lastname?: string|null;
  fullname?: string|null;
  contact?: string|null;
  phone?: string|null;
  company?: string|null;
  address?: string|null;
  city?: string|null;
  zipcode?: string|null;
  startedAt?: DateTime|null;
  isActive?: boolean|null;
}

export interface Item {
  id: number;
  code?: string;
  name: string;
  inventory: Inventory;
  category: Category;
  cost?: number;
  price?: number;
  isActive?: boolean;
  startedAt?: DateTime;
}
