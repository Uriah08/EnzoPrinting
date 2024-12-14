import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req:Request){
    const body = await req.json()
    try {
        const {id,facebook,description,quantity} = body

        if(!id || !quantity) {
            return NextResponse.json({ message: 'Missing required fields', success: false }, { status: 400 });
        }

        await prisma.cart.update({
            where: { id },
            data: {
                quantity,
                description,
                facebook
            }
        })
        
        return NextResponse.json({ message: 'Cart Updated Successfully', success: true }, { status: 200 });
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}