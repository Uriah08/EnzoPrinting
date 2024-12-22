import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';

export async function GET(req: Request) {
    const url = new URL(req.url)
    const id = url.pathname.split("/").pop();
    try {
        const pendingPurchases = await prisma.purchase.findMany({
            where: {
                userId: id,
                received: false,
            },
            select: {
                items: true,
            }
        });

        const purchases = await prisma.purchase.findMany({
            where: {
                userId: id,
            },
            select: {
                items: true,
                cartTotal: true,
                createdAt: true
            }
        });

        const cart = await prisma.cart.count({
            where: {
                userId: id
            }
        })

        const pendingItemsCount = pendingPurchases.reduce((total, purchase) => total + purchase.items.length, 0);
        const cartItemCount = purchases.reduce((total, purchase) => total + purchase.items.length, 0);
        const total = purchases.reduce((total, purchase) => total + parseFloat(purchase.cartTotal), 0);

        const dailySummaryMap = new Map<string, number>();

        purchases.forEach(purchase => {
        const formattedDate = format(purchase.createdAt, 'yyyy-MM-dd');
        const currentTotal = dailySummaryMap.get(formattedDate) || 0;
        dailySummaryMap.set(formattedDate, currentTotal + parseFloat(purchase.cartTotal));
        });

        const dailySummary = Array.from(dailySummaryMap, ([date, order]) => ({
        date,
        order
        }));
        
        return NextResponse.json({ data: { cartItemCount, pendingItemsCount, total, cart, dailySummary }, message: 'Get User Dashboard', success: true}, { status: 200 });
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    };
}