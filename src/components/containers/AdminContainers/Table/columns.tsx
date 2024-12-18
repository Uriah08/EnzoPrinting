"use client"

import { ColumnDef } from "@tanstack/react-table"

type Purchase = {
  id: string;
  cartTotal: string;
  userId: string;
  createdAt: Date;
  status: string;
  new: boolean;
  transaction: string
  user: {
      image?: string
      email: string
  }
}

export const columns: ColumnDef<Purchase>[] = [
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Transaction",
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
