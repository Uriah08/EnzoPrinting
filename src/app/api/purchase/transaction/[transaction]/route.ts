import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request){
    const url = new URL(req.url)
    const transaction = url.pathname.split("/").pop();
    try{
        
        const items = await prisma.purchase.findMany({
            where:{
                transaction
            },
            include: {
                user: {
                    select: {
                        image: true,
                        email: true
                    }
                }
            },
        })

        return NextResponse.json({ items, message: 'Getting Purchase Successful', success: true}, { status: 200 });
    } catch(error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}