import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(req: Request) {
  const url = new URL(req.url)
    const id = url.pathname.split("/").pop();
  try {
    await prisma.cart.deleteMany({
        where: { userId: id },
    })
    return NextResponse.json({ message: 'Cart Deleted Successfully', success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in route handler:', error);
    return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
  }
}