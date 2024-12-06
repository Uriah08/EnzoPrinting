import { loginSchema } from '@/schema'
import { signIn } from '../../../../auth'

import { NextResponse } from 'next/server';
import { DEFAULT_LOGIN_REDIRECT } from '../../../../routes';

import { AuthError } from 'next-auth';

export async function POST(req: Request){

    try {
        const body = await req.json();

        const validatedFields = loginSchema.safeParse(body);
    
        if (!validatedFields.success) {
          return NextResponse.json(
            { error: 'Validation failed', success: false, issues: validatedFields.error.issues },
            { status: 400 }
          );
        }
        const {email, password} = validatedFields.data

        console.log(email,password)
    
        return NextResponse.json({ message: 'User login successfully', success: true}, { status: 201 });
      } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ error: 'Internal Server Error', success: false}, { status: 500 });
      }
    

    // try {
    // await signIn("credentials", {
    //     email, password,
    //     redirectTo: DEFAULT_LOGIN_REDIRECT
    // })
    // } catch (error) {
    //     if(error instanceof AuthError) {
    //     switch (error.type) {
    //         case "CredentialsSignin":
    //             return NextResponse.json(
    //                 { error: 'Invalid credentials', success: false },
    //                 { status: 401 }
    //             );
    //         default:
    //             return NextResponse.json({
    //                 error: 'Something went wrong', success: false
    //             },{status: 401})
    //     }
    // }
    // throw error;
    // }
}