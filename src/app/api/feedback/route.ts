import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request){
    const body = await req.json()

    try {
        const { feedback, userId } = body

        if(!userId) {
            return NextResponse.json({ message: 'User ID is required.', success: false}, { status: 400 });
        }

        await prisma.feedback.create({
            data: {
                feedback,
                userId
            }
        })
        
        return NextResponse.json({ message: 'Feedback has been sent.', success: true },{ status: 200})
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}