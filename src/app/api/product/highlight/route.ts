import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(){
    try {
        const product = await prisma.product.findMany({
            where: {
                highlight: true
            }
        });
        if(!product){
            return NextResponse.json({ message: 'No Product Found', success: false}, { status: 404 });
        } 

        return NextResponse.json({ message: 'Fetch Product Successfully', product, success: true}, { status: 200 })
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}