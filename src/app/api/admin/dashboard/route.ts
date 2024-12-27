import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { format } from "date-fns";

type PurchaseStatusCounts = {
  [key: string]: number;
};

export async function GET() {
  try {
    // Fetch all data concurrently
    const [
      productCount,
      feedbackCount,
      quoteCount,
      purchaseCount,
      purchases,
      purchaseStatusCounts,
      categoryCounts,
      usersWithPurchases,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.feedback.count(),
      prisma.quote.count(),
      prisma.purchase.count({
        where: {
          transaction: "pending",
        },
      }),
      prisma.purchase.findMany({
        select: {
          createdAt: true,
          cartTotal: true,
        },
      }),
      prisma.purchase.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
        where: {
          transaction: "pending",
        },
      }),
      prisma.cartItem.groupBy({
        by: ["category"],
        _count: {
          category: true,
        },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          purhcase: {
            select: {
              items: {
                select: {
                  price: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Process data after fetching
    const dailySummaryMap = new Map<string, number>();
    purchases.forEach((purchase) => {
      const formattedDate = format(purchase.createdAt, "yyyy-MM-dd");
      const currentTotal = dailySummaryMap.get(formattedDate) || 0;
      dailySummaryMap.set(formattedDate, currentTotal + parseFloat(purchase.cartTotal));
    });

    const dailySummary = Array.from(dailySummaryMap, ([date, order]) => ({
      date,
      order,
    }));

    const purchaseStatus = purchaseStatusCounts.reduce((acc, { status, _count }) => {
      acc[status] = _count.status;
      return acc;
    }, {} as PurchaseStatusCounts);

    const categoryCountMap = categoryCounts.reduce((acc, { category, _count }) => {
      acc[category] = _count.category;
      return acc;
    }, {} as { [key: string]: number });

    const usersWithContribution = usersWithPurchases.map((user) => {
      const totalContribution = user.purhcase.reduce((sum, purchase) => {
        return (
          sum +
          purchase.items.reduce(
            (itemSum, item) => itemSum + parseFloat(item.price),
            0
          )
        );
      }, 0);

      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        totalContribution,
      };
    });

    const sortedTopUsers = usersWithContribution
      .sort((a, b) => b.totalContribution - a.totalContribution)
      .slice(0, 3);

    // Return the result
    return NextResponse.json(
      {
        data: {
          dailySummary,
          productCount,
          feedbackCount,
          quoteCount,
          purchaseCount,
          purchaseStatus,
          categoryCountMap,
          topUsers: sortedTopUsers,
        },
        message: "Get Admin Dashboard",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in route handler:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
