// import { Session } from 'next-auth'
// import Link from 'next/link'
// import React from 'react'
// import Image from 'next/image'

// import { useGetQuotesQuery } from '@/store/api'

// const Quotes = ({ session }: {session?: Session | null}) => {

//   const { data, isLoading }  = useGetQuotesQuery()

//   const quotes = data?.quotes || []

//   return (
//     <div className='flex flex-col w-full gap-3 sm:gap-5 h-full '>
//         <div className='flex justify-between w-full bg-[#f5f5f5] py-3 px-5 rounded-lg shadow-lg'>
//         <div className='flex-col'>
//         <div className='flex gap-1 sm:gap-3 items-center'>
//           <Link href={'/'} className='text-xs sm:text-sm text-zinc-500 hover:underline'>Home</Link>
//           <h1 className='text-zinc-500'>/</h1>
//           <h1 className='text-xs sm:text-sm text-zinc-800 cursor-pointer hover:underline'>Admin</h1>
//           <h1 className='text-zinc-500'>/</h1>
//           <h1 className='text-xs sm:text-sm text-zinc-800 cursor-pointer hover:underline'>Quotes</h1>
//         </div>
//         <h1 className='font-semibold text-sm sm:text-lg text-zinc-800'>Quotes</h1>
//         </div>
//         {session && 
//           <div className='cursor-pointer lg:ml-8 xl:ml-14 flex gap-5 items-center'>
//           <Link href={'/profile'} className='flex gap-3'>
//           <div className='flex flex-col text-end'>
//                                 <p className='text-base font-medium text-zinc-800 sm:block hidden'>{session.user.name}</p>
//                                 <p className='text-sm font-medium text-zinc-600 sm:block hidden'>{session.user.email}</p>
//                             </div>
//               <Image src={session.user.image ? session.user.image : '/profile.png'} width={700} height={700} alt='profile' className='size-[45px] rounded-full'/>
//           </Link>
//           </div>
//         }
//       </div>
//       <div className='w-full lg:h-full flex flex-col-reverse lg:flex-row gap-5 overflow-y-hidden'>
//       <div className='h-[100vh] lg:h-full w-full bg-[#f5f5f5] rounded-lg shadow-lg p-5 flex flex-col gap-5'>
//         <h1 className='text-base font-semibold text-zinc-700'>Your Quotes</h1>
//         <div className='flex flex-col gap-3 overflow-auto custom-scroll-bar'>
//           <div className='flex'>
//             <h1>Lorenz Flores</h1>
//             <h1>lorenz08.flores@gmail.com</h1>
//             <h1></h1>
//           </div>
//         </div>
//       </div>
//       </div>
//     </div>
//   )
// }

// export default Quotes