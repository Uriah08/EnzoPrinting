import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type itemProps = {
    name: string;
    image: string
    quantity: string
    price: string
}

export async function POST(req:Request){
    const body = await req.json()
    try {
        const {cartDetails, userId, cartTotal} = body

        if(!cartDetails || !userId || !cartTotal){
            return NextResponse.json({ message: 'Missing required fields', success: false}, { status: 400 });
        }

        await prisma.purchase.create({
            data: {
                userId,
                cartTotal,
                items: {
                    create: cartDetails.map((item: itemProps) => ({
                        name: item.name,
                        image: item.image,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                }
            }
        })
        
        return NextResponse.json({ message: 'Purchase Successful', success: true}, { status: 200 });
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}