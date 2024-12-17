import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req:Request){
    const body  = await req.json()
    try {
        const { id, transaction } = body

        await prisma.purchase.update({
            where: {
                id
            },
            data: {
                transaction
            }
        })
        
        return NextResponse.json({ message: 'Transaction Updated', success: true}, { status: 200 });
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}