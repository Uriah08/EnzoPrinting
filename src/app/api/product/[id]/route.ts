import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: { id: string }}) {
    const { id } = await params

    try {
        if(!id) {
            return NextResponse.json({ message: 'Invalid request', success: false }, { status: 400 });
        }

        await prisma.product.delete({
            where: { id }
        })    
        
        return NextResponse.json({ message: 'Product deleted successfully', success: true });
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}