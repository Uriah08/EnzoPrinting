import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req:Request, {params}: {params: {id: string}}) {
    const { id } = await params
    try {
        const items = await prisma.purchase.findMany({
            where: {
                userId: id,
                received: false
            },
            include: {
                items: {
                    select: {
                        id: true,
                        image: true,
                        name: true,
                        price: true,
                        quantity: true,
                    }
                }
            }
        })
        return NextResponse.json({ items, message: 'Order Get', success: true}, { status: 200 });
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}
