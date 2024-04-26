import type { Avatar } from '#ui/types'
import type { BillPayment, InvoicePayment } from '@prisma/client'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'

export interface User {
  id: string
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
  avatar?: string | null;
  groupId?: number | null;
  group?: Group | null;
  code?: string | null;
  accountNumber?: string | null;
  firstname: string | null;
  lastname?: string | null;
  fullname?: string | null;
  contact?: string | null;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
  city?: string | null;
  zipcode?: string | null;
  startedAt?: DateTime | null;
  isActive?: boolean | null;
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

export interface Invoice {
  id?: number;
  num: number | null;
  type?: string | null;
  entityId?: number | null;
  accountId?: number | null;
  userId?: string | null;
  date: string | null;
  payments?: InvoicePayment[];
  invoiceLines: InvoiceLine[];
  entity: Entity;
  user: User;
  account: Account;
}

export interface InvoiceLine {
  id?: number;
  invoiceId?: number;
  accountId?: number;
  itemId?: number;
  quantity?: number|undefined;
  price?: number|undefined;
  amount?: number;
  invoice?: Invoice;
  item?: Item;
  account?: Account;
}

export interface ChartOfAccount {
  id: number;
  number: number;
  name: string;
  parentId: number;
  openBalance: number;
  balance: number;
  type: string;
  description: string;
  parent: ChartOfAccount;
  subAccounts: ChartOfAccount[];
  bills: Bill[];
  billLines: BillLine[];
  billPayments: BillPayment[];
  invoices: Invoice[];
  invoiceLines: InvoiceLine[];
  invoicePayments: InvoicePayment[];
}

export interface InvoicePayment{
  id: number;
  invoiceId: number|null;
  accountId: number|null;
  date: string|null;
  memo: string|null;
  amount: number;
  invoice: Invoice|null;
  account: ChartOfAccount|null;
}
