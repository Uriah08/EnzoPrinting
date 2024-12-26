import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  email: string;
  type: string;
  phone: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  type,
  phone,
  message,
}) => (
  <div className='flex fle-col'>
    <div className='w-full py-3 bg-[#1A90F1] mb-3'/>
    <h4 className='font-sans text-base'>Quote Request By, {name}!</h4>
    <h4 className='font-sans text-base'>From: {email}</h4>
    <h4 className='font-sans text-base'>Type: {type}</h4>
    <h4 className='font-sans text-base'>Phone: {phone}</h4>
    <p className='font-sans text-sm'>Message: {message}</p>
    <div className='w-full py-3 bg-[#1A90F1] mb-3'/>
  </div>
);
