import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type PurchaseStatusCounts = {
    [key: string]: number;
};

export async function GET() {
    try {
        const productCount = await prisma.product.count();
        const feedbackCount = await prisma.feedback.count();
        const quoteCount = await prisma.quote.count();
        const purchaseCount = await prisma.purchase.count({
            where: {
                transaction: 'pending'
            }
        });

        const purchaseStatusCounts = await prisma.purchase.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
            where: {
                transaction: 'pending',
            },
        });

        const purchaseStatus = purchaseStatusCounts.reduce((acc, { status, _count }) => {
            acc[status] = _count.status;
            return acc;
        }, {} as PurchaseStatusCounts);

        return NextResponse.json({ data: {
            productCount,
            feedbackCount,
            quoteCount,
            purchaseCount,
            purchaseStatus
        }, message: 'Get Admin Dashboard', success: true}, { status: 200 });
    } catch (error) {
        console.error('Error in route handler:', error);
        return NextResponse.json({ message: 'Internal Server Error', success: false}, { status: 500 });
    }
}