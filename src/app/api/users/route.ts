import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

import bcryptjs from 'bcryptjs'

import { registerSchema } from '@/schema';

export async function POST(req: Request){
    try {
        const body = await req.json();

        const validatedFields = registerSchema.safeParse(body);
    
        if (!validatedFields.success) {
          return NextResponse.json(
            { message: 'Validation failed', success: false, issues: validatedFields.error.issues },
            { status: 400 }
          );
        }
        const {username, email, password} = validatedFields.data

        const existingEmail = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        })

        if(existingEmail) {
          return NextResponse.json(
            {
              message: 'Email already exist', success: false,
            },{status: 400})
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
    
        await prisma.user.create({
          data: {
            name: username.toLowerCase(),
            email: email.toLowerCase(),
            password: hashedPassword,
          },
        });
    
        return NextResponse.json({ message: 'User created successfully', success: true}, { status: 201 });
      } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
      }
}