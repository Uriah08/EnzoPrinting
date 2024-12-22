import { Session } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Clock, MessageCircle, Package, ScrollText, ShoppingBag } from 'lucide-react'
import { PieCharts } from '@/components/charts/profile-orders'
import { BarChartX } from '@/components/charts/bar-chart-x'
import { BarChartSticks } from '@/components/charts/bar-chart-x-sticks'
import { RadialBarAdmin } from '@/components/charts/radial-chart'
import { useGetAdminDashboardQuery, useGetHighlightProductQuery } from '@/store/api'

const Dashboard = ({ session }: {session?: Session | null}) => {

  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); 
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: undefined,
    hour12: true,
    weekday: "short",
  });

  const { data, isLoading } = useGetAdminDashboardQuery()
  const { dailySummary, topUsers, categoryCountMap, purchaseStatus, productCount, feedbackCount, quoteCount, purchaseCount } = data?.data || {}
  const safePurchaseStatus = purchaseStatus || { "To Do": 0, "In Progress": 0, "Finished": 0, "Cancelled": 0 };
  
  const safeCategoryCountMap = categoryCountMap || { "bundle": 0, "mug": 0, "shirt": 0, "sticker": 0, "book": 0, "paper": 0, "other": 0, "ID" : 0, "keychain": 0 };
  const { data: highlight } = useGetHighlightProductQuery()
  const highlightProduct = highlight?.product || []
  const finalDailySummary = dailySummary ?? [];
  
  return (
    <div className='flex flex-col w-full gap-5 h-full overflow-x-hidden'>
      <div className='flex justify-between w-full bg-[#f5f5f5] py-3 px-5 rounded-lg shadow-lg'>
        <div className='flex-col'>
        <div className='flex gap-3 items-center'>
          <Link href={'/'} className='text-sm text-zinc-500 hover:underline'>Home</Link>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-sm text-zinc-800 cursor-pointer hover:underline'>Admin</h1>
          <h1 className='text-zinc-500'>/</h1>
          <h1 className='text-sm text-zinc-800 cursor-pointer hover:underline'>Dashboard</h1>
        </div>
        <h1 className='font-semibold text-lg text-zinc-800'>Dashboard</h1>
        </div>
        {session && 
          <div className='cursor-pointer lg:ml-8 xl:ml-14 flex gap-5 items-center'>
          <Link href={'/profile'} className='flex gap-3'>
          <div className='flex flex-col text-end'>
                                <p className='text-base font-medium text-zinc-800 sm:block hidden'>{session.user.name}</p>
                                <p className='text-sm font-medium text-zinc-600 sm:block hidden'>{session.user.email}</p>
                            </div>
              <Image src={session.user.image ? session.user.image : '/profile.png'} width={700} height={700} alt='profile' className='size-[45px] rounded-full'/>
          </Link>
          </div>
        }
      </div>
      <div className='w-full lg:h-full flex flex-col lg:flex-row gap-5 overflow-y-hidden'>
        <div className='lg:w-2/3 h-[100vh] lg:h-full w-full bg-[#f5f5f5] rounded-lg shadow-lg p-5 flex flex-col gap-5 overflow-y-auto custom-scroll-bar'>
          <div className='flex flex-wrap gap-5'>
          <div className='bg-main flex-1 p-5 rounded-lg flex flex-col gap-5 shadow-lg'>
            <div className='flex gap-3 items-center'>
              <Package size={32} className='p-[6px] ml-1 shadow-md rounded-md bg-white text-main' />
              <h1 className='text-[#f5f5f5] text-xl font-semibold'>Products</h1>
            </div>
            <div className='w-full'>
              <h1 style={{ fontSize: "26px" }} className='font-bold text-[#f5f5f5]'>{isLoading ? 0 :  productCount}</h1>
            </div>
          </div>
          <div className='bg-main flex-1 p-5 rounded-lg flex flex-col gap-5 shadow-lg'>
            <div className='flex gap-3 items-center'>
              <ShoppingBag size={32} className='p-[6px] ml-1 shadow-md rounded-md bg-white text-main' />
              <h1 className='text-[#f5f5f5] text-xl font-semibold'>Orders</h1>
            </div>
            <div className='w-full'>
              <h1 style={{ fontSize: "26px" }} className='font-bold text-[#f5f5f5]'>{isLoading ? 0 : purchaseCount}</h1>
            </div>
          </div>
          <div className='bg-main flex-1 p-5 rounded-lg flex flex-col gap-5 shadow-lg'>
            <div className='flex gap-3 items-center'>
              <ScrollText size={32} className='p-[6px] ml-1 shadow-md rounded-md bg-white text-main' />
              <h1 className='text-[#f5f5f5] text-xl font-semibold'>Quotes</h1>
            </div>
            <div className='w-full'>
              <h1 style={{ fontSize: "26px" }} className='font-bold text-[#f5f5f5]'>{isLoading ? 0 : quoteCount}</h1>
            </div>
          </div>
          <div className='bg-main flex-1 p-5 rounded-lg flex flex-col gap-5 shadow-lg'>
            <div className='flex gap-3 items-center'>
              <MessageCircle size={32} className='p-[6px] ml-1 shadow-md rounded-md bg-white text-main' />
              <h1 className='text-[#f5f5f5] text-xl font-semibold'>Feedbacks</h1>
            </div>
            <div className='w-full'>
              <h1 style={{ fontSize: "26px" }} className='font-bold text-[#f5f5f5]'>{isLoading ? 0 : feedbackCount}</h1>
            </div>
          </div>
          </div>
          <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
          <PieCharts
            ToDo={safePurchaseStatus["To Do"]}
            InProgress={safePurchaseStatus["In Progress"]}
            Finished={safePurchaseStatus["Finished"]}
            Cancelled={safePurchaseStatus["Cancelled"]}
          />
            <BarChartX 
            mug={safeCategoryCountMap["mug"]}
            paper={safeCategoryCountMap["paper"]} 
            shirt={safeCategoryCountMap["shirt"]} 
            book={safeCategoryCountMap["book"]} 
            sticker={safeCategoryCountMap["sticker"]} 
            keychain={safeCategoryCountMap["keychain"]} 
            ID={safeCategoryCountMap["ID"]} 
            bundle={safeCategoryCountMap["bundle"]} 
            other={safeCategoryCountMap["other"]} 
            />
          </div>
          <BarChartSticks chartData={finalDailySummary}/>
        </div>
        <div className='lg:w-1/3 h-full bg-[#f5f5f5] rounded-lg shadow-lg p-5 overflow-y-auto custom-scroll-bar'>
        <div className='flex-1 bg-main p-5 rounded-lg flex flex-col gap-5 shadow-lg'>
            <div className='flex gap-3 items-center'>
              <Clock size={32} className='p-[6px] ml-1 shadow-md rounded-md text-main bg-[#f5f5f5]' />
              <h1 className='text-[#f5f5f5] text-xl font-semibold'>Time</h1>
            </div>
            <div className='w-full my-5'>
              <h1 className='text-center text-[#f5f5f5] text-xl font-semibold'>{formattedDate}</h1>
              <h1 style={{ fontSize: "30px" }} className='font-bold text-[#f5f5f5] text-center'>{formattedTime}</h1>
            </div>
          </div>

          <RadialBarAdmin
          Finished={safePurchaseStatus["Finished"]}
          Cancelled={safePurchaseStatus["Cancelled"]}
          />

          <div className='flex flex-col'>
            <h1 className='text-zinc-800 text-base font-semibold'>Top Buyer</h1>
            <h1 className='text-zinc-500 text-xs'>Recognized for consistent purchases and unwavering loyalty.</h1>
            <div className='flex flex-col mt-7 gap-5'>
              {topUsers?.map((user) => (
                <div key={user.userId} className='flex gap-3 items-center'>
                <Image src={user?.image || '/profile.png'} width={500} height={500} alt='profile' className='size-12 rounded-full'/>
                <div className='flex justify-between w-full'>
                <div className='flex flex-col'>
                  <h1 className='font-medium text-zinc-800'>{user.name}</h1>
                  <h1 className='text-zinc-500 text-sm'>{user.email}</h1>
                </div>
                <h1 className='text-xs font-semibold text-zinc-800'>Total: <span className='font-normal'>P {user.totalContribution}.00</span></h1>
                </div>
              </div>
              ))}
            </div>
          </div>


          <div className='flex flex-col mt-7'>
            <h1 className='text-zinc-800 text-base font-semibold'>Highlighted Product</h1>
            <h1 className='text-zinc-500 text-xs'>Featured for its popularity and exceptional value.</h1>
            <div className='flex flex-col mt-5 gap-3'>
              {highlightProduct.map((product) => (
                <div key={product.id} className='flex gap-3'>
                <Image src={product.image} width={500} height={500} alt='profile' className='object-cover max-w-20 w-full h-20'/>
                <div className='flex justify-between w-full'>
                <div className='flex flex-col'>
                  <h1 className='text-xs bg-main py-[2px] px-3 rounded-full w-fit text-[#f5f5f5]'>{product.category}</h1>
                  <h1 className='text-zinc-800 text-lg font-medium'>{product.name}</h1>
                </div>
                <h1 className='text-xs font-semibold text-zinc-800'>Price: <span className='font-normal'>P {product.price}.00</span></h1>
                </div>
              </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard