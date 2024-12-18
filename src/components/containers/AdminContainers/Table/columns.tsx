"use client"

import { ColumnDef } from "@tanstack/react-table"

type Purchase = {
  id: string;
  cartTotal: string;
  userId: string;
  createdAt: Date | string;
  status: string;
  new: boolean;
  received: boolean;
  transaction: string
  user: {
      image?: string
      email: string
  }
}

export const purchaseColumns: ColumnDef<Purchase>[] = [
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Transaction",
  },
  {
    accessorKey: "received",
    header: "Received"
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "cartTotal",
    header: "Total",
  },
]

type UserOrder = {
  id: string,
    image: string,
    name: string,
    price: string,
    quantity: string,
}

type UserHistory = {
  id: string;
  cartTotal: string;
  userId: string;
  createdAt: Date | string;
  status: string;
  new: boolean;
  received: boolean
  transaction: string
  items: UserOrder[]
}

export const historyColumns: ColumnDef<UserHistory>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Transaction",
  },
  {
    accessorKey: "received",
    header: "Received"
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "cartTotal",
    header: "Total",
  },
]

