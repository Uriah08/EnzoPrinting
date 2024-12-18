import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req:Request){
    const url = new URL(req.url)
    const id = url.pathname.split("/").pop();
    try {
        const orders = await prisma.cartItem.findMany({
            where: {
                purchaseId: id
            }
        })
        return NextResponse.json({ orders, message: 'Get Orders', success: true}, { status: 200 });
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}