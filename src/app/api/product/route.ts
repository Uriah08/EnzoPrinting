import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req:Request){
    const body = await req.json()
    try {
        const { name, description, price, category, image } = body

        if(!image){
            return NextResponse.json({ message: 'Image Required', success: false }, { status: 400 });
        }

        if(!name || !description || !price || !category){
            return NextResponse.json({ message: 'Missing required fields', success: false }, { status: 400 });
        }

        await prisma.product.create({
            data: {
                name,
                description,
                price,
                category,
                image,
            },
        })

        return NextResponse.json({ message: 'Product Created', success: true },{ status: 200})
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}

export async function GET(){
    try {
        const product = await prisma.product.findMany();
        if(!product){
            return NextResponse.json({ message: 'No Product Found', success: false}, { status: 404 });
        } 

        return NextResponse.json({ message: 'Fetch Product Successfully', product, success: true}, { status: 200 })
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const body = await req.json()
    try {
        const { id, status } = body
        if(!id) {
            return NextResponse.json({ message: 'Invalid request', success: false }, { status: 400 });
        }
        const currentProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (status && !currentProduct?.highlight) {
            const highlightedCount = await prisma.product.count({
                where: { highlight: true },
            });

            if (highlightedCount >= 4) {
                return NextResponse.json(
                    { message: "Cannot highlight more than 4 products", success: false },
                    { status: 400 }
                );
            }
        }
        
        await prisma.product.update({
            where: { id },
            data: {
                highlight: status,
            }
        })
        return NextResponse.json({ message: 'Product Highlighted', success: true });
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}