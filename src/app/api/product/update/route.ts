import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.json()
    try {
        const { id, name, description, category, price, status } = body
        if(!id || !name || !description || !category || !price){
            return NextResponse.json({ message: 'Missing required fields', success: false }, { status: 400 });
        }    

        await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                category,
                price,
                status
            },
        })

        return NextResponse.json({ message: 'Product updated successfully', success: true }, { status: 200 });

    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}