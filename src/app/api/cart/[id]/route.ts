import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request, { params } : { params : { id: string }}) {
    const { id } = await params
    try {
        
        const cart = await prisma.cart.findMany({
            where: {
                userId: id
            },
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  image: true,
                  category: true
                }
              }
            }
        })

        return NextResponse.json({ cart, message: 'Retrieve Cart', success: true }, { status: 200 });
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}