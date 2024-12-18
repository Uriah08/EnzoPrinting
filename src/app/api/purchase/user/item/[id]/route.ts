import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req:Request) {
    const url = new URL(req.url)
    const id = url.pathname.split("/").pop();
    try {
        await prisma.purchase.update({
            where: {
                id
            },
            data: {
                received: true
            }
        })
        
        return NextResponse.json({ message: 'Order Received', success: true}, { status: 200 });
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}

export async function GET(req:Request) {
    const url = new URL(req.url)
    const id = url.pathname.split("/").pop();
    try {
        const items = await prisma.purchase.findMany({
            where: {
                userId: id,
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