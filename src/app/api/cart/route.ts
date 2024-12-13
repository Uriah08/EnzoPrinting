import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.json()
    try {
        const { facebook, description, productId, quantity, userId } = body

        await prisma.cart.create({
            data: {
                productId,
                userId,
                quantity,
                description,
                facebook
            },
        })
        
        return NextResponse.json({ message: 'Cart has been added.', success: true},{ status: 200})
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}

export async function DELETE() {
    try {
      await prisma.cart.deleteMany()
        
      return NextResponse.json({ message: 'Cart Deleted Successfully', success: true }, { status: 200 });
    } catch (error) {
      console.error('Error in route handler:', error);
      return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
  }