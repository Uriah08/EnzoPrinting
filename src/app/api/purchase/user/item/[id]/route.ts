import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req:Request, {params}: {params: {id: string}}) {
    const { id } = await params
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
