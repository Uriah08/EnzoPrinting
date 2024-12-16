import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { quoteSchema } from "@/schema";

export async function POST(req: Request){
    const body = await req.json();
    try {

        const validatedFields = quoteSchema.safeParse(body);

        if(!validatedFields.success){
            return NextResponse.json({ message: 'Invalid input', success: false}, { status: 400 });
        }

        const { name, email, type, phone, message} = validatedFields.data

        await prisma.quote.create({
            data: {
                name,
                email,
                type,
                phone: phone.toString(),
                message
            }
        })
        return NextResponse.json({ message: 'Quote Sent!', success: true}, { status: 200 });
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}