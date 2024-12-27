import { EmailTemplate } from '@/components/ui/email_template';
import { quoteSchema } from '@/schema';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const validatedFields = quoteSchema.safeParse(body);
    
    if(!validatedFields.success){
        return NextResponse.json({ message: 'Invalid input', success: false}, { status: 400 });
    }
    
    const { name, email, type, phone, message} = validatedFields.data

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Hello world',
      react: EmailTemplate({ name, email, type, phone, message }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
